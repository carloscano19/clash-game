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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      arbitrage_decisions: {
        Row: {
          confidence: number
          created_at: string
          decision: string
          duel_id: string
          id: string
          model: string
          prompt_hash: string
          raw_response: Json
        }
        Insert: {
          confidence: number
          created_at?: string
          decision: string
          duel_id: string
          id?: string
          model: string
          prompt_hash: string
          raw_response: Json
        }
        Update: {
          confidence?: number
          created_at?: string
          decision?: string
          duel_id?: string
          id?: string
          model?: string
          prompt_hash?: string
          raw_response?: Json
        }
        Relationships: [
          {
            foreignKeyName: "arbitrage_decisions_duel_id_fkey"
            columns: ["duel_id"]
            isOneToOne: false
            referencedRelation: "duels"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          id: string
          kind: string
          match_id: string
          parsed_predicate: Json
          raw_text: string
          side_a_predicate: Json
          side_b_predicate: Json
          time_window_end_minute: number
          time_window_start_minute: number
        }
        Insert: {
          id?: string
          kind: string
          match_id: string
          parsed_predicate: Json
          raw_text: string
          side_a_predicate: Json
          side_b_predicate: Json
          time_window_end_minute: number
          time_window_start_minute: number
        }
        Update: {
          id?: string
          kind?: string
          match_id?: string
          parsed_predicate?: Json
          raw_text?: string
          side_a_predicate?: Json
          side_b_predicate?: Json
          time_window_end_minute?: number
          time_window_start_minute?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenges_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      duels: {
        Row: {
          arbitrage_confidence: number | null
          challenge_id: string | null
          id: string
          match_id: string
          resolution_reason: string | null
          resolved_at: string | null
          stake_amount: number
          stake_currency: string
          stake_token_symbol: string | null
          status: string
          user_a: string
          user_b: string
          winner_user_id: string | null
        }
        Insert: {
          arbitrage_confidence?: number | null
          challenge_id?: string | null
          id?: string
          match_id: string
          resolution_reason?: string | null
          resolved_at?: string | null
          stake_amount: number
          stake_currency: string
          stake_token_symbol?: string | null
          status: string
          user_a: string
          user_b: string
          winner_user_id?: string | null
        }
        Update: {
          arbitrage_confidence?: number | null
          challenge_id?: string | null
          id?: string
          match_id?: string
          resolution_reason?: string | null
          resolved_at?: string | null
          stake_amount?: number
          stake_currency?: string
          stake_token_symbol?: string | null
          status?: string
          user_a?: string
          user_b?: string
          winner_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "duels_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duels_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duels_user_a_fkey"
            columns: ["user_a"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duels_user_a_fkey"
            columns: ["user_a"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duels_user_b_fkey"
            columns: ["user_b"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duels_user_b_fkey"
            columns: ["user_b"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duels_winner_user_id_fkey"
            columns: ["winner_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duels_winner_user_id_fkey"
            columns: ["winner_user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          direction: string
          duel_id: string
          id: string
          token_symbol: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          direction: string
          duel_id: string
          id?: string
          token_symbol?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          direction?: string
          duel_id?: string
          id?: string
          token_symbol?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "escrow_transactions_duel_id_fkey"
            columns: ["duel_id"]
            isOneToOne: false
            referencedRelation: "duels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escrow_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escrow_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      fan_token_balances: {
        Row: {
          balance: number
          token_symbol: string
          user_id: string
        }
        Insert: {
          balance?: number
          token_symbol: string
          user_id: string
        }
        Update: {
          balance?: number
          token_symbol?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fan_token_balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fan_token_balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      lobbies: {
        Row: {
          id: string
          is_open: boolean
          match_id: string
        }
        Insert: {
          id?: string
          is_open?: boolean
          match_id: string
        }
        Update: {
          id?: string
          is_open?: boolean
          match_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lobbies_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      lobby_entries: {
        Row: {
          entered_at: string
          id: string
          lobby_id: string
          matched_with: string | null
          stake_amount: number
          stake_currency: string
          stake_token_symbol: string | null
          status: string
          user_id: string
        }
        Insert: {
          entered_at?: string
          id?: string
          lobby_id: string
          matched_with?: string | null
          stake_amount: number
          stake_currency: string
          stake_token_symbol?: string | null
          status: string
          user_id: string
        }
        Update: {
          entered_at?: string
          id?: string
          lobby_id?: string
          matched_with?: string | null
          stake_amount?: number
          stake_currency?: string
          stake_token_symbol?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lobby_entries_lobby_id_fkey"
            columns: ["lobby_id"]
            isOneToOne: false
            referencedRelation: "lobbies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lobby_entries_matched_with_fkey"
            columns: ["matched_with"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lobby_entries_matched_with_fkey"
            columns: ["matched_with"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lobby_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lobby_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_team: string
          external_id: string
          home_team: string
          id: string
          kickoff_at: string
          status: string
        }
        Insert: {
          away_team: string
          external_id: string
          home_team: string
          id?: string
          kickoff_at: string
          status: string
        }
        Update: {
          away_team?: string
          external_id?: string
          home_team?: string
          id?: string
          kickoff_at?: string
          status?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          ssu_balance: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          id: string
          ssu_balance?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          ssu_balance?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      users_public: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string | null
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_duel: { Args: { p_duel_id: string }; Returns: undefined }
      decline_duel: { Args: { p_duel_id: string }; Returns: undefined }
      lock_escrow: { Args: { p_duel_id: string }; Returns: undefined }
      propose_challenge: {
        Args: { p_duel_id: string; p_predicate: Json; p_raw_text: string }
        Returns: undefined
      }
      refund_escrow: { Args: { p_duel_id: string }; Returns: undefined }
      release_escrow_to_winner: {
        Args: { p_duel_id: string; p_winner_id: string }
        Returns: undefined
      }
      try_match: {
        Args: { p_lobby_id: string; p_user_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
