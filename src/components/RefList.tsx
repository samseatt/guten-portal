"use client";

import EditorialList, { EditorialScope } from "./EditorialList";

export default function RefList(props: EditorialScope) {
  return <EditorialList key={JSON.stringify(props)} kind="refs" {...props} />;
}
