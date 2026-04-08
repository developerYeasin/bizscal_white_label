"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { User, Pencil, Trash2 } from "lucide-react";

const UserCard = ({ user, isYou = false, onEditClick, onDeleteClick }) => {
  const { id, name, email, role, permissions } = user;

  return (
    <Card className="mb-4">
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <p className="font-semibold text-lg">
              {name} {isYou && <span className="text-sm text-muted-foreground">(You)</span>}
            </p>
            <p className="text-sm text-muted-foreground">{email}</p>
            <Badge variant="secondary" className="mt-1 capitalize">{role}</Badge>
            {permissions && permissions.length > 0 && role !== 'owner' && (
              <div className="flex flex-wrap gap-1 mt-2">
                {permissions.map((perm, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {perm.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            )}
            {role === 'owner' && (
              <p className="text-xs text-muted-foreground mt-1">Full access</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isYou && (
            <>
              <Button variant="ghost" size="icon" onClick={() => onEditClick(user)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDeleteClick(id, name)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;