'use client';

import { commentSorter } from "@/lib/sorters";
import timeSince from "@/functions/timeSince";
import { Comment } from "@prisma/client";
import styles from './comments.module.css'
import { ChangeEvent, useRef, useState } from "react";

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

  /* Handle input from span */
  const [editedContent, setEditedContent] = useState('');
  const handleInput = (event: ChangeEvent<HTMLSpanElement>) => {
    setEditedContent(event.target.innerText);
  };

  const spanRef = useRef<HTMLSpanElement>(null);
  const removeText = () => {
    if (spanRef.current) {
      spanRef.current.innerHTML = ''
    }
    setEditedContent('')
  }

  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const expandComment = (commentId: string) => {
    setExpandedComments((prevExpandedComments) => {
      if (prevExpandedComments.includes(commentId)) {
        return prevExpandedComments.filter((id) => id !== commentId);
      } else {
        return [...prevExpandedComments, commentId];
      }
    });
  };

  return (
    <>
      <section className="container-text margin-y-300">
        <h2>{comments?.length} Kommentarer</h2>
        <form onSubmit={handleSubmit}>
          <span className={styles.textarea} role="textbox" id="comment-text" contentEditable aria-label="Skriv Kommentar" aria-placeholder="Skriv Kommentar" onInput={handleInput} onBlur={handleInput} ref={spanRef}></span>
          <input type="hidden" name="comment" id="comment" value={editedContent} />
          <div className="display-flex justify-content-flex-end gap-50 padding-y-50">
            <button type="button" disabled={!editedContent} className={`${styles.button} ${styles.cancel}`} onClick={removeText}>Avbryt</button>
            <button type="submit" disabled={!editedContent} className={`${styles.button} ${styles.comment}`}>Skicka</button>
          </div>
        </form>
        {comments?.map((comment) => (
          <div key={comment.id}>
            <p className="flex align-items-center gap-50" style={{ marginBottom: '0' }}>
              <a className={styles.commentAuthor} href={`/user/${comment.author.username}`}>{comment.author.username}</a>
              <span style={{ color: 'gray', fontWeight: '300', fontSize: '.75rem' }}>{`${timeSince(new Date(comment.createdAt))} sedan`}</span>
            </p>
            <p className="margin-0" style={{ wordBreak: 'break-word', }}>
              {expandedComments.includes(comment.id) ? comment.commentText : comment.commentText.length > 300 ? `${comment.commentText.substring(0, 300)}...` : comment.commentText}
            </p>
            {comment.commentText.length > 300 ?
              <button className={`margin-y-25 ${styles.readMoreButton}`} onClick={() => expandComment(comment.id)}>
                {expandedComments.includes(comment.id) ? 'Visa mindre' : 'Visa mer'}
              </button>
              : null}
          </div>
        ))}
      </section>
    </>
  )
}