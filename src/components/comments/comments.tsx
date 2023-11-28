'use client';

import { commentSorter } from "@/lib/sorters";
import { Comment } from "@prisma/client";

export default function Comments({ comments, objectId }: { comments?: (Comment & { author: { id: string, username: string } })[], objectId: string }) {
  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.target.elements
    const comment = (form.namedItem("comment") as HTMLInputElement)?.value
    const formJSON = JSON.stringify({
      commentText: comment,
      objectId,
    })
    fetch('/api/comment', {
      method: 'POST',
      body: formJSON,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        return res.json().then((data) => {
          throw new Error(data.message)
        })
      }
    }).then((data) => {
      window.location.reload()
    }).catch((err) => {
      alert(err.message)
    });
  }

  // Sort comments by date
  comments?.sort(commentSorter);

  return (
    <>
      <h2>Kommentarer</h2>
      {comments?.map((comment) => (
        <div key={comment.id}>
          <p><b>{comment.author.username}</b> <i>{new Date(comment.createdAt).toLocaleString('sv-SE')}</i></p>
          <p>{comment.commentText}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <div className="display-flex gap-100">
          <input type="text" name="comment" id="comment" style={{borderRadius: "3px", border: "none", padding: "1em"}} />
          <input type="submit" value="Skicka" className="call-to-action-primary" style={{height: "100%"}} />
        </div>
      </form>
    </>
  )
}