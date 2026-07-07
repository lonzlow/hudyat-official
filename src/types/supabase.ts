export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      contents: {
        Row: {
          contentId: number
          title: string
          excerpt: string | null
          paragraph: string | null
          date: string | null
          slug: string
          typeId: number
          authorId: number | null
          imageId: number | null
        }
        Insert: {
          contentId?: number
          title: string
          excerpt?: string | null
          paragraph?: string | null
          date?: string | null
          slug: string
          typeId: number
          authorId?: number | null
          imageId?: number | null
        }
        Update: {
          contentId?: number
          title?: string
          excerpt?: string | null
          paragraph?: string | null
          date?: string | null
          slug?: string
          typeId?: number
          authorId?: number | null
          imageId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contents_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["authorId"]
          },
          {
            foreignKeyName: "contents_imageId_fkey"
            columns: ["imageId"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["imageId"]
          }
        ]
      }
      authors: {
        Row: {
          authorId: number
          authorName: string
          avatarUrl: string | null
        }
        Insert: {
          authorId?: number
          authorName: string
          avatarUrl?: string | null
        }
        Update: {
          authorId?: number
          authorName?: string
          avatarUrl?: string | null
        }
        Relationships: []
      }
      images: {
        Row: {
          imageId: number
          imageLink: string
          altText: string | null
        }
        Insert: {
          imageId?: number
          imageLink: string
          altText?: string | null
        }
        Update: {
          imageId?: number
          imageLink?: string
          altText?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          videoId: number
          videoLink: string
          videoName: string | null
        }
        Insert: {
          videoId?: number
          videoLink: string
          videoName?: string | null
        }
        Update: {
          videoId?: number
          videoLink?: string
          videoName?: string | null
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
