import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Save } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const updateProfile = useMutation({
    mutationFn: async (values: any) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              updateProfile.mutate({
                full_name: formData.get('full_name'),
                username: formData.get('username'),
                bio: formData.get('bio'),
                website: formData.get('website'),
              });
            }} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile?.full_name || ''}
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={profile?.username || ''}
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-1">
                  Bio
                </label>
                <Input
                  id="bio"
                  name="bio"
                  defaultValue={profile?.bio || ''}
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-1">
                  Website
                </label>
                <Input
                  id="website"
                  name="website"
                  defaultValue={profile?.website || ''}
                />
              </div>

              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            <p className="text-muted-foreground">
              Notification settings will be implemented in a future update.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
            <p className="text-muted-foreground">
              Appearance settings will be implemented in a future update.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}