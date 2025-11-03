export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      check_ins: {
        Row: {
          calorie_goal_met:
            | Database["public"]["Enums"]["calorie_goal_status"]
            | null
          check_in_date: string | null
          cravings_scale: number | null
          created_at: string | null
          current_weight: number | null
          id: string
          profile_id: string | null
        }
        Insert: {
          calorie_goal_met?:
            | Database["public"]["Enums"]["calorie_goal_status"]
            | null
          check_in_date?: string | null
          cravings_scale?: number | null
          created_at?: string | null
          current_weight?: number | null
          id?: string
          profile_id?: string | null
        }
        Update: {
          calorie_goal_met?:
            | Database["public"]["Enums"]["calorie_goal_status"]
            | null
          check_in_date?: string | null
          cravings_scale?: number | null
          created_at?: string | null
          current_weight?: number | null
          id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          profile_id: string
          role: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          profile_id: string
          role?: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          profile_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_reports: {
        Row: {
          active_member_count: number | null
          avg_weight_lost_per_member: number | null
          created_at: string | null
          generated_at: string
          group_consistency_score: number | null
          group_id: string
          id: string
          participation_rate: number | null
          period_end_date: string
          period_start_date: string
          report_data: Json | null
          report_period_type: Database["public"]["Enums"]["report_period_type"]
          status: string
          top_performer_name: string | null
          top_performer_profile_id: string | null
          top_performer_weight_lost: number | null
          total_check_ins: number | null
          total_member_count: number | null
          total_weight_lost: number | null
          updated_at: string | null
        }
        Insert: {
          active_member_count?: number | null
          avg_weight_lost_per_member?: number | null
          created_at?: string | null
          generated_at?: string
          group_consistency_score?: number | null
          group_id: string
          id?: string
          participation_rate?: number | null
          period_end_date: string
          period_start_date: string
          report_data?: Json | null
          report_period_type: Database["public"]["Enums"]["report_period_type"]
          status?: string
          top_performer_name?: string | null
          top_performer_profile_id?: string | null
          top_performer_weight_lost?: number | null
          total_check_ins?: number | null
          total_member_count?: number | null
          total_weight_lost?: number | null
          updated_at?: string | null
        }
        Update: {
          active_member_count?: number | null
          avg_weight_lost_per_member?: number | null
          created_at?: string | null
          generated_at?: string
          group_consistency_score?: number | null
          group_id?: string
          id?: string
          participation_rate?: number | null
          period_end_date?: string
          period_start_date?: string
          report_data?: Json | null
          report_period_type?: Database["public"]["Enums"]["report_period_type"]
          status?: string
          top_performer_name?: string | null
          top_performer_profile_id?: string | null
          top_performer_weight_lost?: number | null
          total_check_ins?: number | null
          total_member_count?: number | null
          total_weight_lost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_reports_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_reports_top_performer_profile_id_fkey"
            columns: ["top_performer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          current_height: number | null
          current_weight: number | null
          email: string | null
          first_name: string | null
          goal_weight: number | null
          id: string
          last_name: string | null
          phone: string | null
          profile_code: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_height?: number | null
          current_weight?: number | null
          email?: string | null
          first_name?: string | null
          goal_weight?: number | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_height?: number | null
          current_weight?: number | null
          email?: string | null
          first_name?: string | null
          goal_weight?: number | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      report_group_comparisons: {
        Row: {
          comparison_notes: Json | null
          created_at: string | null
          group_report_id: string
          id: string
          is_top_performer: boolean | null
          report_id: string
          user_rank_in_group: number | null
          weight_lost_percentile: number | null
        }
        Insert: {
          comparison_notes?: Json | null
          created_at?: string | null
          group_report_id: string
          id?: string
          is_top_performer?: boolean | null
          report_id: string
          user_rank_in_group?: number | null
          weight_lost_percentile?: number | null
        }
        Update: {
          comparison_notes?: Json | null
          created_at?: string | null
          group_report_id?: string
          id?: string
          is_top_performer?: boolean | null
          report_id?: string
          user_rank_in_group?: number | null
          weight_lost_percentile?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "report_group_comparisons_group_report_id_fkey"
            columns: ["group_report_id"]
            isOneToOne: false
            referencedRelation: "group_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_group_comparisons_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          avg_cravings_scale: number | null
          calorie_goal_adherence_rate: number | null
          check_in_consistency_rate: number | null
          created_at: string | null
          current_goal_weight: number | null
          ending_weight: number | null
          generated_at: string
          id: string
          period_end_date: string
          period_start_date: string
          possible_check_ins: number | null
          profile_id: string
          progress_to_goal_percentage: number | null
          report_data: Json | null
          report_period_type: Database["public"]["Enums"]["report_period_type"]
          starting_weight: number | null
          status: string
          total_check_ins: number | null
          updated_at: string | null
          weight_change: number | null
        }
        Insert: {
          avg_cravings_scale?: number | null
          calorie_goal_adherence_rate?: number | null
          check_in_consistency_rate?: number | null
          created_at?: string | null
          current_goal_weight?: number | null
          ending_weight?: number | null
          generated_at?: string
          id?: string
          period_end_date: string
          period_start_date: string
          possible_check_ins?: number | null
          profile_id: string
          progress_to_goal_percentage?: number | null
          report_data?: Json | null
          report_period_type: Database["public"]["Enums"]["report_period_type"]
          starting_weight?: number | null
          status?: string
          total_check_ins?: number | null
          updated_at?: string | null
          weight_change?: number | null
        }
        Update: {
          avg_cravings_scale?: number | null
          calorie_goal_adherence_rate?: number | null
          check_in_consistency_rate?: number | null
          created_at?: string | null
          current_goal_weight?: number | null
          ending_weight?: number | null
          generated_at?: string
          id?: string
          period_end_date?: string
          period_start_date?: string
          possible_check_ins?: number | null
          profile_id?: string
          progress_to_goal_percentage?: number | null
          report_data?: Json | null
          report_period_type?: Database["public"]["Enums"]["report_period_type"]
          starting_weight?: number | null
          status?: string
          total_check_ins?: number | null
          updated_at?: string | null
          weight_change?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      calorie_goal_status: "yes" | "no" | "did_not_track" | "no_calorie_goal"
      report_period_type: "weekly" | "monthly" | "yearly"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      calorie_goal_status: ["yes", "no", "did_not_track", "no_calorie_goal"],
      report_period_type: ["weekly", "monthly", "yearly"],
    },
  },
} as const
