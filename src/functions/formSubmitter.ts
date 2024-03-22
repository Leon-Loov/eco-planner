'use client';

import { SetStateAction } from "react";

/**
 * Submits the data from a form to the API and handles the response
 * @param target The URL to submit the form to
 * @param body A JSON string containing the data to be submitted
 * @param method The HTTP method to use, either "POST" or "PUT"
 * @param loadingStateSetter A function to set the isLoading state of the form
 */
export default function formSubmitter(
  target: string,
  body: string | null,
  method: "POST" | "PUT" | "DELETE",
  loadingStateSetter?: (value: SetStateAction<boolean>) => void,
) {
  fetch(target, {
    method,
    body,
    headers: { 'Content-Type': 'application/json' },
  }).then(async (res) => {
    if (res.ok) {
      return { body: await res.json(), location: res.headers.get('Location') };
    } else {
      if (res.status >= 400) {
        const data = await res.json();
        // Throw the massage and any location provided by the API
        throw { message: data.message, location: res.headers.get('Location') };
      } else {
        throw new Error('Något gick fel');
      }
    }
  }).then(data => {
    if (loadingStateSetter) {
      loadingStateSetter(false);
    }
    // If the API provides a message, alert it
    if (data.body.message) {
      alert(data.body.message);
    }
    // Redirect to the location provided by the API, or, if missing, to nearest valid parent
    // POST is on pages such as /roadmap/[id]/goal/createGoal, which should default to /roadmap/[id] if no location is provided
    // PUT is on pages such as /roadmap/[id]/goal/[id]/editGoal, which should default to /roadmap/[id]/goal/[id] if no location is provided
    window.location.href = data.location ?? (method == "POST" ? "../" : "./")
  }).catch((err) => {
    if (loadingStateSetter) loadingStateSetter(false);
    console.error(err);
    alert(`Något gick fel: ${err.message}`)
    if (err.location) {
      window.location.href = err.location;
    }
  });
}