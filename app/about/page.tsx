export const metadata = { title: "About" }

export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="font-display text-4xl font-bold">About Hudyat</h1>
      <div className="mt-8 max-w-3xl space-y-6">
        <section>
          <h2 className="font-display text-2xl font-bold">Mission</h2>
          <p className="mt-2 text-muted-foreground">
            To serve as the voice of the student body, upholding truth, integrity, and excellence in campus journalism.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold">Vision</h2>
          <p className="mt-2 text-muted-foreground">
            A community of empowered student journalists shaping public opinion and fostering democratic discourse.
          </p>
        </section>
      </div>
    </div>
  )
}
