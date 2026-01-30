export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            badges: {
                Row: {
                    created_at: string | null
                    description: string
                    icon: string
                    id: string
                    name: string
                    xp_requirement: number
                }
                Insert: {
                    created_at?: string | null
                    description: string
                    icon: string
                    id?: string
                    name: string
                    xp_requirement?: number
                }
                Update: {
                    created_at?: string | null
                    description?: string
                    icon?: string
                    id?: string
                    name?: string
                    xp_requirement?: number
                }
                Relationships: []
            }
            component_verifications: {
                Row: {
                    ai_confidence: number | null
                    ai_result: string | null
                    component_id: string | null
                    created_at: string | null
                    id: string
                    image_url: string
                    manual_verified: boolean | null
                    status: Database["public"]["Enums"]["verification_status"]
                    teardown_session_id: string | null
                    user_id: string | null
                    verified_at: string | null
                    verified_by: string | null
                    xp_awarded: number
                }
                Insert: {
                    ai_confidence?: number | null
                    ai_result?: string | null
                    component_id?: string | null
                    created_at?: string | null
                    id?: string
                    image_url: string
                    manual_verified?: boolean | null
                    status?: Database["public"]["Enums"]["verification_status"]
                    teardown_session_id?: string | null
                    user_id?: string | null
                    verified_at?: string | null
                    verified_by?: string | null
                    xp_awarded?: number
                }
                Update: {
                    ai_confidence?: number | null
                    ai_result?: string | null
                    component_id?: string | null
                    created_at?: string | null
                    id?: string
                    image_url?: string
                    manual_verified?: boolean | null
                    status?: Database["public"]["Enums"]["verification_status"]
                    teardown_session_id?: string | null
                    user_id?: string | null
                    verified_at?: string | null
                    verified_by?: string | null
                    xp_awarded?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "component_verifications_component_id_fkey"
                        columns: ["component_id"]
                        isOneToOne: false
                        referencedRelation: "device_components"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "component_verifications_teardown_session_id_fkey"
                        columns: ["teardown_session_id"]
                        isOneToOne: false
                        referencedRelation: "teardown_sessions"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "component_verifications_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "component_verifications_verified_by_fkey"
                        columns: ["verified_by"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            components: {
                Row: {
                    category: string
                    created_at: string | null
                    description: string | null
                    hazard_warnings: string[] | null
                    id: string
                    image_url: string | null
                    learning_outcome: string | null
                    name: string
                    suggested_price: number | null
                    tier: Database["public"]["Enums"]["hazard_level"]
                }
                Insert: {
                    category: string
                    created_at?: string | null
                    description?: string | null
                    hazard_warnings?: string[] | null
                    id?: string
                    image_url?: string | null
                    learning_outcome?: string | null
                    name: string
                    suggested_price?: number | null
                    tier?: Database["public"]["Enums"]["hazard_level"]
                }
                Update: {
                    category?: string
                    created_at?: string | null
                    description?: string | null
                    hazard_warnings?: string[] | null
                    id?: string
                    image_url?: string | null
                    learning_outcome?: string | null
                    name?: string
                    suggested_price?: number | null
                    tier?: Database["public"]["Enums"]["hazard_level"]
                }
                Relationships: []
            }
            device_components: {
                Row: {
                    description: string | null
                    device_id: string | null
                    hazards: string[] | null
                    id: string
                    name: string
                    type: string
                    value: number
                }
                Insert: {
                    description?: string | null
                    device_id?: string | null
                    hazards?: string[] | null
                    id?: string
                    name: string
                    type: string
                    value: number
                }
                Update: {
                    description?: string | null
                    device_id?: string | null
                    hazards?: string[] | null
                    id?: string
                    name?: string
                    type?: string
                    value?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "device_components_device_id_fkey"
                        columns: ["device_id"]
                        isOneToOne: false
                        referencedRelation: "devices"
                        referencedColumns: ["id"]
                    }
                ]
            }
            devices: {
                Row: {
                    brand: string
                    created_at: string | null
                    description: string | null
                    difficulty: string | null
                    id: string
                    image_url: string | null
                    model: string | null
                    model_year: number | null
                    name: string
                    safety_tier: string | null
                    total_value: number | null
                    type: string
                }
                Insert: {
                    brand: string
                    created_at?: string | null
                    description?: string | null
                    difficulty?: string | null
                    id?: string
                    image_url?: string | null
                    model?: string | null
                    model_year?: number | null
                    name: string
                    safety_tier?: string | null
                    total_value?: number | null
                    type: string
                }
                Update: {
                    brand?: string
                    created_at?: string | null
                    description?: string | null
                    difficulty?: string | null
                    id?: string
                    image_url?: string | null
                    model?: string | null
                    model_year?: number | null
                    name?: string
                    safety_tier?: string | null
                    total_value?: number | null
                    type?: string
                }
                Relationships: []
            }
            listings: {
                Row: {
                    component_id: string | null
                    component_verification_id: string | null
                    created_at: string | null
                    id: string
                    price: number
                    seller_id: string | null
                    status: Database["public"]["Enums"]["listing_status"]
                }
                Insert: {
                    component_id?: string | null
                    component_verification_id?: string | null
                    created_at?: string | null
                    id?: string
                    price: number
                    seller_id?: string | null
                    status?: Database["public"]["Enums"]["listing_status"]
                }
                Update: {
                    component_id?: string | null
                    component_verification_id?: string | null
                    created_at?: string | null
                    id?: string
                    price?: number
                    seller_id?: string | null
                    status?: Database["public"]["Enums"]["listing_status"]
                }
                Relationships: [
                    {
                        foreignKeyName: "listings_component_id_fkey"
                        columns: ["component_id"]
                        isOneToOne: false
                        referencedRelation: "device_components"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "listings_component_verification_id_fkey"
                        columns: ["component_verification_id"]
                        isOneToOne: false
                        referencedRelation: "component_verifications"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "listings_seller_id_fkey"
                        columns: ["seller_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            marketplace_listings: {
                Row: {
                    condition: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    image_url: string | null
                    is_verified: boolean | null
                    name: string
                    price: number
                    seller_name: string
                    type: string
                }
                Insert: {
                    condition?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    is_verified?: boolean | null
                    name: string
                    price: number
                    seller_name: string
                    type: string
                }
                Update: {
                    condition?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    is_verified?: boolean | null
                    name?: string
                    price?: number
                    seller_name?: string
                    type?: string
                }
                Relationships: []
            }
            teardown_sessions: {
                Row: {
                    completed_at: string | null
                    created_at: string | null
                    device_id: string | null
                    id: string
                    started_at: string
                    status: Database["public"]["Enums"]["session_status"]
                    user_id: string | null
                }
                Insert: {
                    completed_at?: string | null
                    created_at?: string | null
                    device_id?: string | null
                    id?: string
                    started_at?: string
                    status?: Database["public"]["Enums"]["session_status"]
                    user_id?: string | null
                }
                Update: {
                    completed_at?: string | null
                    created_at?: string | null
                    device_id?: string | null
                    id?: string
                    started_at?: string
                    status?: Database["public"]["Enums"]["session_status"]
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "teardown_sessions_device_id_fkey"
                        columns: ["device_id"]
                        isOneToOne: false
                        referencedRelation: "devices"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "teardown_sessions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            teardown_steps: {
                Row: {
                    component_id: string | null
                    created_at: string | null
                    description: string
                    device_id: string | null
                    educational_context: Json | null
                    has_safety_gate: boolean | null
                    hazard_level: Database["public"]["Enums"]["hazard_level"]
                    id: string
                    image_url: string | null
                    instructions: string[]
                    ppe_required: string[] | null
                    power_off_required: boolean
                    required_tools: string[] | null
                    safety_warnings: string[] | null
                    step_number: number
                    title: string
                    video_url: string | null
                }
                Insert: {
                    component_id?: string | null
                    created_at?: string | null
                    description: string
                    device_id?: string | null
                    educational_context?: Json | null
                    has_safety_gate?: boolean | null
                    hazard_level?: Database["public"]["Enums"]["hazard_level"]
                    id?: string
                    image_url?: string | null
                    instructions: string[]
                    ppe_required?: string[] | null
                    power_off_required?: boolean
                    required_tools?: string[] | null
                    safety_warnings?: string[] | null
                    step_number: number
                    title: string
                    video_url?: string | null
                }
                Update: {
                    component_id?: string | null
                    created_at?: string | null
                    description?: string
                    device_id?: string | null
                    educational_context?: Json | null
                    has_safety_gate?: boolean | null
                    hazard_level?: Database["public"]["Enums"]["hazard_level"]
                    id?: string
                    image_url?: string | null
                    instructions?: string[]
                    ppe_required?: string[] | null
                    power_off_required?: boolean
                    required_tools?: string[] | null
                    safety_warnings?: string[] | null
                    step_number?: number
                    title?: string
                    video_url?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "teardown_steps_component_id_fkey"
                        columns: ["component_id"]
                        isOneToOne: false
                        referencedRelation: "device_components"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "teardown_steps_device_id_fkey"
                        columns: ["device_id"]
                        isOneToOne: false
                        referencedRelation: "devices"
                        referencedColumns: ["id"]
                    }
                ]
            }
            users: {
                Row: {
                    created_at: string | null
                    email: string
                    id: string
                    name: string
                    role: Database["public"]["Enums"]["user_role"]
                    school: string | null
                    updated_at: string | null
                    xp: number
                }
                Insert: {
                    created_at?: string | null
                    email: string
                    id: string
                    name: string
                    role?: Database["public"]["Enums"]["user_role"]
                    school?: string | null
                    updated_at?: string | null
                    xp?: number
                }
                Update: {
                    created_at?: string | null
                    email?: string
                    id?: string
                    name?: string
                    role?: Database["public"]["Enums"]["user_role"]
                    school?: string | null
                    updated_at?: string | null
                    xp?: number
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            device_type: "laptop" | "printer" | "phone" | "tablet" | "other"
            difficulty_level: "beginner" | "intermediate" | "advanced"
            hazard_level: "low" | "medium" | "high"
            listing_condition: "excellent" | "good" | "fair" | "poor"
            listing_status: "draft" | "live" | "sold" | "donated" | "removed"
            request_status: "pending" | "accepted" | "rejected" | "completed"
            session_status: "in_progress" | "completed" | "abandoned"
            user_role: "student" | "teacher" | "admin"
            verification_status: "pending" | "verified" | "rejected"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
