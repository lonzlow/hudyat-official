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
          status: 'draft' | 'review' | 'published'
          created_by: string | null
          updated_at: string
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
          status?: 'draft' | 'review' | 'published'
          created_by?: string | null
          updated_at?: string
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
          status?: 'draft' | 'review' | 'published'
          created_by?: string | null
          updated_at?: string
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
      article_views: {
        Row: {
          view_id: number
          content_id: number
          viewed_at: string
        }
        Insert: {
          view_id?: number
          content_id: number
          viewed_at?: string
        }
        Update: {
          view_id?: number
          content_id?: number
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_views_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["content_id"]
          }
        ]
      }
      tags: {
        Row: {
          tag_id: number
          name: string
          slug: string
        }
        Insert: {
          tag_id?: number
          name: string
          slug: string
        }
        Update: {
          tag_id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      content_tags: {
        Row: {
          content_id: number
          tag_id: number
        }
        Insert: {
          content_id: number
          tag_id: number
        }
        Update: {
          content_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_tags_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "content_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["tag_id"]
          }
        ]
      }
      staff: {
        Row: {
          user_id: string
          email: string | null
          role: 'writer' | 'editor'
          author_id: number | null
          created_at: string
        }
        Insert: {
          user_id: string
          email?: string | null
          role: 'writer' | 'editor'
          author_id?: number | null
          created_at?: string
        }
        Update: {
          user_id?: string
          email?: string | null
          role?: 'writer' | 'editor'
          author_id?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["author_id"]
          }
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
      [_ in never]: never
    }
  }
}
