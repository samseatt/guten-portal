"use client";

import EditorialList, { EditorialScope } from "./EditorialList";

export default function NoteList(props: EditorialScope) {
  return <EditorialList key={JSON.stringify(props)} kind="notes" {...props} />;
}
