'use client';

import { commentSorter } from "@/lib/sorters";
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
      <section>
        <h2>Kommentarer</h2>
        <form onSubmit={handleSubmit}>
          <span className={styles.textarea} role="textbox" id="comment-text" contentEditable aria-placeholder="Skriv Kommentar" onInput={handleInput} onBlur={handleInput} ref={spanRef}></span>
          <input type="hidden" name="comment" id="comment" value={editedContent} />
          <div className="display-flex justify-content-flex-end gap-50 padding-y-50">
            <button type="button" className={`${styles.button} ${styles.cancel}`} onClick={removeText}>Avbryt</button>
            <input type="submit" value="Skicka" disabled={!editedContent} className={`${styles.button} ${styles.comment}`} style={{height: "100%"}} />
          </div>
        </form>
        {comments?.map((comment) => (
          <div key={comment.id}>
            <p style={{marginBottom: "0", textTransform: "capitalize"}}><b>{comment.author.username}</b></p>
            <span style={{fontSize: ".75em"}}>{new Date(comment.createdAt).toLocaleString('sv-SE')}</span>
            <p>
            {expandedComments.includes(comment.id) ? comment.commentText : comment.commentText.length > 300 ? `${comment.commentText.substring(0, 300)}...` : comment.commentText}
            </p>  
            {comment.commentText.length > 300 ? 
              <button className={styles.readMoreButton} onClick={() => expandComment(comment.id)}>  
                {expandedComments.includes(comment.id) ? 'Visa mindre' : 'Visa mer'}
              </button>
            :  null}
          </div> 
        ))}
      </section>
    </>
  )
}