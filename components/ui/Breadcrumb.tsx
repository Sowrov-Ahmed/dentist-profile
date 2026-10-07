import Link from "next/link";

export function Breadcrumb({ title, current, sourceTemplate = false }: { title: string; current?: string; sourceTemplate?: boolean }) {
  return (
    <section
      className="breadcrumb"
      style={{
        backgroundImage: sourceTemplate
          ? "linear-gradient(90deg, rgba(14,29,76,.92), rgba(14,29,76,.72)), url('/assets/img/breadcrumb-bg.jpg')"
          : "url('/assets/img/breadcrumb-bg.jpg')"
      }}
    >
      <div className={`${sourceTemplate ? "container-kliniko " : ""}breadcrumb-inner`}>
        <h1>{title}</h1>
        <div className="breadcrumb-trail" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-separator">{sourceTemplate ? "//" : "/"}</span>
          <span>{current || title}</span>
        </div>
      </div>
    </section>
  );
}
