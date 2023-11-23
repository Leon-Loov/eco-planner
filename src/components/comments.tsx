'use client';

import { Comment } from "@prisma/client";

export default function Comments({ comments, objectId }: { comments?: Comment[], objectId: string }) {
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
  return (
    <>
      <h2>Kommentarer</h2>
      {comments?.map((comment) => (
        <div key={comment.id}>
          <p>{comment.createdAt.toLocaleString('sv-SE')}</p>
          <p>{comment.commentText}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input type="text" name="comment" id="comment" />
        <input type="submit" value="Skicka" />
      </form>
    </>
  )
}