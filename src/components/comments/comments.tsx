'use client';

import { commentSorter } from "@/lib/sorters";
import { Comment } from "@prisma/client";
import styles from './comments.module.css'
import { ChangeEvent, useState } from "react";

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
  const [editedContent, setEditedContent] = useState('Editable content');
  const handleInput = (event: ChangeEvent<HTMLSpanElement>) => {
    setEditedContent(event.target.innerText);
    console.log(editedContent)
  };

  return (
    <>
      <h2>Kommentarer</h2>
      <form onSubmit={handleSubmit}>
        <span className={styles.textarea} role="textbox" contentEditable aria-placeholder="Skriv Kommentar" onInput={handleInput} onBlur={handleInput} ></span>
        <input type="hidden" name="comment" id="comment" value={editedContent} />
        <div className="display-flex justify-content-flex-end gap-50 padding-y-50">
          {/*
          <button className={`${styles.button} ${styles.cancel}`}>Avbryt</button>
          <button className={`${styles.button} ${styles.comment}`} >Kommentera</button>
           */}
          <input type="submit" value="Skicka" className="call-to-action-primary" style={{height: "100%"}} />

        </div>
      </form>
      {/*
      <form onSubmit={handleSubmit}>
        <div className="display-flex gap-100">
          <input type="text" name="comment" id="comment" style={{borderRadius: "3px", border: "none", padding: "1em"}} />
          <input type="reset" value="reset"  style={{height: "100%"}} />
          <input type="submit" value="Skicka" className="call-to-action-primary" style={{height: "100%"}} />
        </div>
      </form>
      */}
      {comments?.map((comment) => (
        <div key={comment.id}>
          <p><b>{comment.author.username}</b> <i>{new Date(comment.createdAt).toLocaleString('sv-SE')}</i></p>
          <p>{comment.commentText}</p>
        </div>
      ))}
    </>
  )
}