import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@shared/schema";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="h-24 w-24 mx-auto">
          <AvatarImage src={user.profileImage || undefined} />
          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold mt-4">{user.fullName}</h3>
        <p className="text-sm text-muted-foreground">{user.bio}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Services</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.services?.map((service) => (
                <Badge key={service} variant="secondary">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
          {user.hourlyRate && (
            <div>
              <h4 className="text-sm font-medium">Hourly Rate</h4>
              <p className="text-2xl font-bold">${user.hourlyRate}/hr</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}