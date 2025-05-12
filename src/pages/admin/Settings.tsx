import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useState } from 'react';

const USER_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'reader', label: 'Leitor' },
];

export default function Settings() {
  const { toast } = useToast();
  const [userLoading, setUserLoading] = useState(false);
  const [userForm, setUserForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'reader',
  });

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

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleUserRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserLoading(true);
    try {
      // 1. Cria usuário no Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: userForm.email,
        password: userForm.password,
      });
      if (signUpError) throw signUpError;
      const user = signUpData.user;
      if (!user) throw new Error('Usuário não criado.');

      // 2. Cria perfil na tabela profiles
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        full_name: userForm.full_name,
        role: userForm.role,
        created_at: new Date().toISOString(),
      });
      if (profileError) throw profileError;

      toast({
        title: 'Sucesso',
        description: 'Usuário criado! Verifique o e-mail para confirmação.',
        variant: 'default',
      });
      setUserForm({ full_name: '', email: '', password: '', role: 'reader' });
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Falha ao cadastrar usuário',
        variant: 'destructive',
      });
    } finally {
      setUserLoading(false);
    }
  };

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
          <TabsTrigger value="users">Usuários</TabsTrigger>
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

        <TabsContent value="users" className="space-y-6">
          <Card className="p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4">Cadastro de Usuário</h2>
            <form onSubmit={handleUserRegister} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium mb-1">
                  Nome Completo
                </label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={userForm.full_name}
                  onChange={handleUserFormChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Senha
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={userForm.password}
                  onChange={handleUserFormChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">
                  Papel
                </label>
                <select
                  id="role"
                  name="role"
                  value={userForm.role}
                  onChange={handleUserFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  {USER_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={userLoading}>
                {userLoading ? 'Cadastrando...' : 'Cadastrar Usuário'}
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}