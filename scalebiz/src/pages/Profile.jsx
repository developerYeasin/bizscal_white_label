"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { User, LogOut, Pencil, X, Check, Eye, EyeOff } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast.js";
import api from "@/utils/api.js";
import { useAuth } from "@/contexts/AuthContext.jsx"; // Import useAuth

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth(); // Get user and logout from AuthContext
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);

  // States for editable fields
  const [editedName, setEditedName] = React.useState("");
  const [editedEmail, setEditedEmail] = React.useState("");
  const [editedPhoneNumber, setEditedPhoneNumber] = React.useState("");
  const [editedAvatarUrl, setEditedAvatarUrl] = React.useState("");
  const [editedPreferredLanguage, setEditedPreferredLanguage] = React.useState("");
  const [editedTimezone, setEditedTimezone] = React.useState("");

  // States for password change
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  const fetchProfile = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // If AuthContext already has user data, use it. Otherwise, fetch.
      if (authUser) {
        setUserData(authUser);
        setEditedName(authUser.name || "");
        setEditedEmail(authUser.email || "");
        setEditedPhoneNumber(authUser.phone_number || "");
        setEditedAvatarUrl(authUser.avatar_url || "");
        setEditedPreferredLanguage(authUser.preferred_language || "");
        setEditedTimezone(authUser.timezone || "");
        showSuccess("Profile data loaded!");
      } else {
        // Fallback if authUser is null (shouldn't happen with ProtectedRoute)
        const response = await api.get("/owner/auth/me");
        const owner = response.data.data.owner;
        setUserData(owner);
        setEditedName(owner.name || "");
        setEditedEmail(owner.email || "");
        setEditedPhoneNumber(owner.phone_number || "");
        setEditedAvatarUrl(owner.avatar_url || "");
        setEditedPreferredLanguage(owner.preferred_language || "");
        setEditedTimezone(owner.timezone || "");
        showSuccess("Profile data loaded!");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.response?.data?.message || "Failed to load profile data.");
      showError(err.response?.data?.message || "Failed to load profile data.");
      logout(); // Log out if profile data cannot be fetched
    } finally {
      setLoading(false);
    }
  }, [authUser, logout]);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    setLoading(true);
    await logout(); // Use logout from AuthContext
    navigate("/login");
    setLoading(false);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // If exiting edit mode without saving, reset edited fields to current userData
      setEditedName(userData.name || "");
      setEditedEmail(userData.email || "");
      setEditedPhoneNumber(userData.phone_number || "");
      setEditedAvatarUrl(userData.avatar_url || "");
      setEditedPreferredLanguage(userData.preferred_language || "");
      setEditedTimezone(userData.timezone || "");
    }
    setEditMode((prev) => !prev);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await api.put("/owner/auth/me", {
        name: editedName,
        email: editedEmail,
        phone_number: editedPhoneNumber,
        avatar_url: editedAvatarUrl,
        preferred_language: editedPreferredLanguage,
        timezone: editedTimezone,
      });
      setUserData(response.data.data.owner);
      showSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      showError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    try {
      await api.patch("/owner/auth/update-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      showSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Failed to update password:", err);
      showError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-destructive">{error}</p>
        <Button onClick={handleLogout} className="ml-4 mt-4">Go to Login</Button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>No user data found. Please log in.</p>
        <Button onClick={handleLogout} className="ml-4 mt-4">Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={editedAvatarUrl || "https://github.com/shadcn.png"} alt={editedName} />
              <AvatarFallback>
                <User className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">{editedName}</h2>
          </div>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                readOnly={!editMode}
                className={`mt-1 ${!editMode ? "bg-muted" : ""}`}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                readOnly={!editMode}
                className={`mt-1 ${!editMode ? "bg-muted" : ""}`}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={editedPhoneNumber}
                onChange={(e) => setEditedPhoneNumber(e.target.value)}
                readOnly={!editMode}
                className={`mt-1 ${!editMode ? "bg-muted" : ""}`}
              />
            </div>
            <div>
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                type="url"
                value={editedAvatarUrl}
                onChange={(e) => setEditedAvatarUrl(e.target.value)}
                readOnly={!editMode}
                className={`mt-1 ${!editMode ? "bg-muted" : ""}`}
              />
            </div>
            <div>
              <Label htmlFor="preferredLanguage">Preferred Language</Label>
              <Input
                id="preferredLanguage"
                value={editedPreferredLanguage}
                onChange={(e) => setEditedPreferredLanguage(e.target.value)}
                readOnly={!editMode}
                className={`mt-1 ${!editMode ? "bg-muted" : ""}`}
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={editedTimezone}
                onChange={(e) => setEditedTimezone(e.target.value)}
                readOnly={!editMode}
                className={`mt-1 ${!editMode ? "bg-muted" : ""}`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            {editMode ? (
              <>
                <Button variant="outline" onClick={handleEditToggle} disabled={loading}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleUpdateProfile} disabled={loading}>
                  <Check className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleEditToggle} disabled={loading}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="grid gap-4">
            <div className="grid gap-2 relative">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="pr-10"
                disabled={isChangingPassword}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-muted-foreground"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                disabled={isChangingPassword}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="pr-10"
                disabled={isChangingPassword}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-muted-foreground"
                onClick={() => setShowNewPassword((prev) => !prev)}
                disabled={isChangingPassword}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isChangingPassword}>
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Button
        variant="destructive"
        className="w-full mt-4"
        onClick={handleLogout}
        disabled={loading || isChangingPassword}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default Profile;