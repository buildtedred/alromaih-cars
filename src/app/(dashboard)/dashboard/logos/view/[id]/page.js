"use client"

import LogoDetail from "../logo-detail"


export default function Page({ params }) {
  return <LogoDetail id={params.id} />
}
