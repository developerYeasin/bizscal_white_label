"use client";

import { useState, useCallback, useRef, useMemo } from "react";

/**
 * Custom hook for managing hierarchical canvas state with undo/redo
 * @param {Array} initialItems - Initial array of root items (tree structure)
 */
const useCanvasState = (initialItems = []) => {
  const [tree, setTree] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Undo/Redo history stores full tree snapshots
  const past = useRef([]);
  const future = useRef([]);
  const MAX_HISTORY = 50;

  // Deep clone helper
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  // Push current tree to history before making changes (accepts functional updater)
  const pushToHistory = useCallback((updater) => {
    setTree(prev => {
      // Save current state to history before updating
      past.current = [...past.current.slice(-MAX_HISTORY + 1), deepClone(prev)];
      future.current = [];
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
    setIsDirty(true);
  }, []);

  // Find a node by id anywhere in the tree
  const findNode = useCallback((nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Update nodes recursively: returns a new array with updater applied to node with given id
  const updateNodesRecursive = useCallback((nodes, id, updater) => {
    return nodes.map(node => {
      if (node.id === id) {
        return updater(node);
      }
      if (node.children) {
        return { ...node, children: updateNodesRecursive(node.children, id, updater) };
      }
      return node;
    });
  }, []);

  // Remove node (and its subtree) from tree, returns new array
  const removeNodeFromTree = useCallback((nodes, id) => {
    return nodes.reduce((acc, node) => {
      if (node.id === id) {
        return acc; // skip this node (remove)
      }
      if (node.children) {
        acc.push({ ...node, children: removeNodeFromTree(node.children, id) });
      } else {
        acc.push(node);
      }
      return acc;
    }, []);
  }, []);

  // Insert a node under a parent (parentId null = root). Supports index insertion.
  const insertNodeIntoTree = useCallback((nodes, parentId, newNode, index = null) => {
    if (parentId === null) {
      if (index !== null) {
        const newNodes = [...nodes];
        newNodes.splice(index, 0, newNode);
        return newNodes;
      }
      return [...nodes, newNode];
    }

    return nodes.map(node => {
      if (node.id === parentId) {
        const children = node.children || [];
        if (index !== null) {
          const newChildren = [...children];
          newChildren.splice(index, 0, newNode);
          return { ...node, children: newChildren };
        }
        return { ...node, children: [...children, newNode] };
      }
      if (node.children) {
        return { ...node, children: insertNodeIntoTree(node.children, parentId, newNode, index) };
      }
      return node;
    });
  }, []);

  // Extract a subtree (node with its children) from the tree, returns {extracted, remaining}
  const extractSubtree = useCallback((nodes, id) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.id === id) {
        // Remove this node from array, return it and remaining nodes
        const newNodes = [...nodes];
        newNodes.splice(i, 1);
        return { extracted: node, remaining: newNodes };
      }
      if (node.children) {
        const result = extractSubtree(node.children, id);
        if (result.extracted) {
          // Update the parent's children with the remaining children subtree
          const newNodes = [...nodes];
          newNodes[i] = { ...node, children: result.remaining };
          return { extracted: result.extracted, remaining: newNodes };
        }
      }
    }
    return { extracted: null, remaining: nodes };
  }, []);

  // Public API
  const addItem = useCallback((item, parentId = null, index = null) => {
    const newItem = { ...item, id: item.id || Date.now() + Math.random(), children: item.children || [] };
    pushToHistory(prev => insertNodeIntoTree(prev, parentId, newItem, index));
    setSelectedId(newItem.id);
  }, [pushToHistory]);

  const updateItem = useCallback((id, updates) => {
    pushToHistory(prev => updateNodesRecursive(prev, id, (node) => ({ ...node, ...updates })));
  }, [pushToHistory]);

  const updateItemData = useCallback((id, key, value) => {
    pushToHistory(prev => updateNodesRecursive(prev, id, (node) => ({
      ...node,
      data: { ...node.data, [key]: value }
    })));
  }, [pushToHistory]);

  const deleteItem = useCallback((id) => {
    pushToHistory(prev => removeNodeFromTree(prev, id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  }, [pushToHistory, selectedId]);

  const duplicateItem = useCallback((id, parentId = null, index = null) => {
    const node = findNode(tree, id);
    if (!node) return;
    const cloned = deepClone(node);
    cloned.id = Date.now() + Math.random();
    addItem(cloned, parentId, index);
  }, [tree, findNode, addItem]);

  const moveItem = useCallback((id, newParentId, newIndex = -1) => {
    // Extract the subtree
    const { extracted, remaining } = extractSubtree(tree, id);
    if (!extracted) return;
    // Determine insertion index; if newIndex is -1, append at end
    const insertIndex = newIndex === -1 ? null : newIndex;
    const newTree = insertNodeIntoTree(remaining, newParentId, extracted, insertIndex);
    pushToHistory(newTree);
  }, [tree, pushToHistory]);

  const undo = useCallback(() => {
    if (past.current.length === 0) return;
    const previous = deepClone(past.current[past.current.length - 1]);
    const current = deepClone(tree);
    future.current = [current, ...future.current.slice(0, MAX_HISTORY - 1)];
    past.current = past.current.slice(0, -1);
    setTree(previous);
  }, [past, tree]);

  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    const next = deepClone(future.current[0]);
    const current = deepClone(tree);
    past.current = [...past.current.slice(-MAX_HISTORY + 1), current];
    future.current = future.current.slice(1);
    setTree(next);
  }, [past, future, tree]);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  const selectItem = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const markSaved = useCallback(() => {
    setIsDirty(false);
    past.current = [];
    future.current = [];
  }, []);

  const reset = useCallback((newTree = []) => {
    setTree(deepClone(newTree));
    setSelectedId(null);
    setIsDirty(false);
    past.current = [];
    future.current = [];
  }, []);

  // Bulk update: accept a mutator function (draft => void) that modifies a deep clone of the tree
  const updateItems = useCallback((mutator) => {
    pushToHistory(prev => {
      const next = deepClone(prev);
      mutator(next);
      return next;
    });
  }, [pushToHistory]);

  const selectedItem = useMemo(() => {
    if (selectedId === null) return null;
    return findNode(tree, selectedId);
  }, [tree, selectedId, findNode]);

  return {
    items: tree,
    selectedId,
    selectedItem,
    isDirty,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
    addItem,
    updateItem,
    updateItemData,
    updateItems,
    deleteItem,
    duplicateItem,
    moveItem,
    selectItem,
    clearSelection,
    undo,
    redo,
    markSaved,
    reset,
    _history: { past: past.current, future: future.current },
  };
};

export default useCanvasState;
