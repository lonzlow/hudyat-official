export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      contents: {
        Row: {
          content_id: number
          title: string
          excerpt: string | null
          paragraph: string | null
          date: string | null
          slug: string
          type_id: number
          author_id: number | null
          image_id: number | null
        }
        Insert: {
          content_id?: number
          title: string
          excerpt?: string | null
          paragraph?: string | null
          date?: string | null
          slug: string
          type_id: number
          author_id?: number | null
          image_id?: number | null
        }
        Update: {
          content_id?: number
          title?: string
          excerpt?: string | null
          paragraph?: string | null
          date?: string | null
          slug?: string
          type_id?: number
          author_id?: number | null
          image_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contents_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "contents_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["image_id"]
          }
        ]
      }
      authors: {
        Row: {
          author_id: number
          author_name: string
          avatar_url: string | null
        }
        Insert: {
          author_id?: number
          author_name: string
          avatar_url?: string | null
        }
        Update: {
          author_id?: number
          author_name?: string
          avatar_url?: string | null
        }
        Relationships: []
      }
      images: {
        Row: {
          image_id: number
          image_link: string
          alt_text: string | null
        }
        Insert: {
          image_id?: number
          image_link: string
          alt_text?: string | null
        }
        Update: {
          image_id?: number
          image_link?: string
          alt_text?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          video_id: number
          video_link: string
          video_name: string | null
        }
        Insert: {
          video_id?: number
          video_link: string
          video_name?: string | null
        }
        Update: {
          video_id?: number
          video_link?: string
          video_name?: string | null
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
      [_ in never]: never
    }
  }
}
