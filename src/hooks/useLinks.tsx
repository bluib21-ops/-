import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  click_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useLinks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["links", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", user.id)
        .order("position", { ascending: true });
      
      if (error) throw error;
      return data as Link[];
    },
    enabled: !!user,
  });

  const addLink = useMutation({
    mutationFn: async (newLink: { title: string; url: string; icon?: string }) => {
      if (!user) throw new Error("Not authenticated");
      
      const position = links.length;
      
      const { data, error } = await supabase
        .from("links")
        .insert({
          user_id: user.id,
          title: newLink.title,
          url: newLink.url,
          icon: newLink.icon || "🔗",
          position,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Link;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user?.id] });
    },
  });

  const updateLink = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Link> & { id: string }) => {
      const { data, error } = await supabase
        .from("links")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Link;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user?.id] });
    },
  });

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("links")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user?.id] });
    },
  });

  return { links, isLoading, addLink, updateLink, deleteLink };
}

export function usePublicLinks(userId: string) {
  return useQuery({
    queryKey: ["public-links", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("position", { ascending: true });
      
      if (error) throw error;
      return data as Link[];
    },
    enabled: !!userId,
  });
}

