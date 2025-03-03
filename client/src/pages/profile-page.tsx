import { useAuth } from "@/hooks/use-auth";
import { ProfileCard } from "@/components/profile-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div>
          <ProfileCard user={user} />
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{user.bio}</p>
            </CardContent>
          </Card>

          {user.userType === "vendor" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Portfolio</CardTitle>
                <Button variant="outline" size="sm">
                  Add Project
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                    alt="Portfolio"
                    className="rounded-lg aspect-video object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a"
                    alt="Portfolio"
                    className="rounded-lg aspect-video object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1508657594088-375f2f60c581"
                    alt="Portfolio"
                    className="rounded-lg aspect-video object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
