import { expect, test, type Page } from "@playwright/test"

test("signed-out visitors are sent to the login page", async ({ page }) => {
  await page.goto("/admin")
  await expect(page).toHaveURL(/\/admin\/login$/)
  await expect(page.getByRole("heading", { name: "Hudyat CMS" })).toBeVisible()

  await page.goto("/admin/articles/new")
  await expect(page).toHaveURL(/\/admin\/login$/)
})

test("the CMS is hidden from search engines", async ({ request }) => {
  const robots = await request.get("/robots.txt")
  expect(await robots.text()).toContain("Disallow: /admin")
})

// The flows below need seeded accounts: set E2E_WRITER_EMAIL / E2E_WRITER_PASSWORD and
// E2E_EDITOR_EMAIL / E2E_EDITOR_PASSWORD (local Supabase only).
const writer = { email: process.env.E2E_WRITER_EMAIL, password: process.env.E2E_WRITER_PASSWORD }
const editor = { email: process.env.E2E_EDITOR_EMAIL, password: process.env.E2E_EDITOR_PASSWORD }

async function signIn(page: Page, who: { email?: string; password?: string }) {
  await page.goto("/admin/login")
  await page.getByLabel("Email").fill(who.email!)
  await page.getByLabel("Password").fill(who.password!)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

test.describe("with seeded accounts", () => {
  test.skip(!writer.email || !editor.email, "Seeded writer and editor accounts not configured")

  test("a wrong password is rejected", async ({ page }) => {
    await page.goto("/admin/login")
    await page.getByLabel("Email").fill(writer.email!)
    await page.getByLabel("Password").fill("not-the-password")
    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(page.getByRole("alert")).toContainText("Wrong email or password")
  })

  test("a writer cannot open the editor-only pages or publish", async ({ page }) => {
    await signIn(page, writer)
    await page.goto("/admin/staff")
    await expect(page).toHaveURL(/\/admin$/)
    await expect(page.getByRole("button", { name: "Publish" })).toHaveCount(0)
  })

  test("a draft stays private until an editor publishes it", async ({ browser }) => {
    const slug = `e2e-${Date.now()}`

    const writerPage = await (await browser.newContext()).newPage()
    await signIn(writerPage, writer)
    await writerPage.goto("/admin/articles/new")
    await writerPage.getByLabel("Title").fill(`E2E ${slug}`)
    await writerPage.getByLabel("Slug").fill(slug)
    await writerPage.getByLabel("Body").fill("First paragraph.\nSecond paragraph.")
    await writerPage.getByRole("button", { name: "Submit for review" }).click()
    await expect(writerPage).toHaveURL(/\/admin\/articles\/\d+$/)

    const visitor = await (await browser.newContext()).newPage()
    expect((await visitor.goto(`/article/${slug}`))?.status()).toBe(404)

    const editorPage = await (await browser.newContext()).newPage()
    await signIn(editorPage, editor)
    await editorPage.getByRole("link", { name: `E2E ${slug}` }).click()
    await editorPage.getByRole("button", { name: "Publish" }).click()
    await expect(editorPage.getByText("Published.")).toBeVisible()

    await visitor.goto(`/article/${slug}`)
    await expect(visitor.getByRole("heading", { name: `E2E ${slug}` })).toBeVisible()
  })
})
