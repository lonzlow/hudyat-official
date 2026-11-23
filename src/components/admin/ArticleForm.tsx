"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { articleSchema, slugify, type ArticleInput, type ArticleStatus } from "@/lib/cms/schema"
import { saveArticle, uploadCoverImage } from "@/lib/cms/article-actions"

const SECTIONS: Record<number, string> = {
  1: "News",
  2: "Feature",
  3: "Editorial",
  4: "Opinion",
  5: "Literary",
  6: "Sports",
}

interface ArticleFormProps {
  articleId: number | null
  status: ArticleStatus
  role: "writer" | "editor"
  initial: ArticleInput
  coverUrl: string | null
  authors: { author_id: number; author_name: string }[]
  tags: { tag_id: number; name: string }[]
}

export function ArticleForm({ articleId, status, role, initial, coverUrl, authors, tags }: ArticleFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [slugTouched, setSlugTouched] = useState(articleId !== null)
  const [cover, setCover] = useState<string | null>(coverUrl)
  const [coverAlt, setCoverAlt] = useState("")
  const [uploading, setUploading] = useState(false)

  const form = useForm<ArticleInput>({
    resolver: zodResolver(articleSchema),
    defaultValues: initial,
  })

  function submit(then?: "review" | "publish") {
    return form.handleSubmit((values) => {
      startTransition(async () => {
        const res = await saveArticle(articleId, values, then)
        if (!res.ok) {
          toast.error(res.error)
          return
        }
        toast.success(then === "publish" ? "Published." : then === "review" ? "Sent for review." : "Saved.")
        if (articleId === null) router.replace(`/admin/articles/${res.id}`)
        else router.refresh()
      })
    })
  }

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const data = new FormData()
    data.set("file", file)
    data.set("alt", coverAlt)
    const res = await uploadCoverImage(data)
    setUploading(false)
    e.target.value = ""
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    form.setValue("image_id", res.image_id, { shouldDirty: true })
    setCover(res.url)
  }

  const selectedTags = form.watch("tag_ids")
  const busy = pending || uploading

  return (
    <Form {...form}>
      <form onSubmit={submit()} className="space-y-6" noValidate>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    if (!slugTouched) form.setValue("slug", slugify(e.target.value), { shouldValidate: true })
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    setSlugTouched(true)
                    field.onChange(e)
                  }}
                />
              </FormControl>
              <FormDescription>The article address: /article/{form.watch("slug") || "…"}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(SECTIONS).map(([id, name]) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Byline</FormLabel>
                <Select
                  value={field.value === null ? "none" : String(field.value)}
                  onValueChange={(v) => field.onChange(v === "none" ? null : Number(v))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Hudyat Staff</SelectItem>
                    {authors.map((a) => (
                      <SelectItem key={a.author_id} value={String(a.author_id)}>
                        {a.author_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>Leave empty to use the publish date.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormDescription>Shown in article lists and link previews.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <fieldset className="space-y-3 rounded-md border p-4">
          <legend className="px-1 text-sm font-medium">Cover image</legend>
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="max-h-48 rounded-md object-cover" />
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cover-alt">Alt text (describe the image)</Label>
              <Input id="cover-alt" value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover-file">{cover ? "Replace image" : "Upload image"} (JPG, PNG, WebP, max 5 MB)</Label>
              <Input
                id="cover-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onCoverChange}
                disabled={uploading}
              />
            </div>
          </div>
        </fieldset>

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea rows={18} className="font-serif text-base leading-relaxed" {...field} />
              </FormControl>
              <FormDescription>Each line break starts a new paragraph.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {tags.length > 0 && (
          <fieldset className="space-y-3 rounded-md border p-4">
            <legend className="px-1 text-sm font-medium">Tags</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {tags.map((t) => (
                <div key={t.tag_id} className="flex items-center gap-2">
                  <Checkbox
                    id={`tag-${t.tag_id}`}
                    checked={selectedTags.includes(t.tag_id)}
                    onCheckedChange={(on) =>
                      form.setValue(
                        "tag_ids",
                        on ? [...selectedTags, t.tag_id] : selectedTags.filter((id) => id !== t.tag_id),
                        { shouldDirty: true }
                      )
                    }
                  />
                  <Label htmlFor={`tag-${t.tag_id}`} className="font-normal">
                    {t.name}
                  </Label>
                </div>
              ))}
            </div>
          </fieldset>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t pt-6">
          <Button type="submit" variant="outline" disabled={busy}>
            Save
          </Button>

          {role === "writer" && status !== "review" && (
            <Button type="button" onClick={submit("review")} disabled={busy}>
              Submit for review
            </Button>
          )}
          {role === "editor" && status !== "published" && (
            <Button type="button" onClick={submit("publish")} disabled={busy}>
              Publish
            </Button>
          )}

          {articleId !== null && (
            <Button asChild variant="ghost">
              <Link href={`/admin/preview/${articleId}`} target="_blank">
                Preview ↗
              </Link>
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
