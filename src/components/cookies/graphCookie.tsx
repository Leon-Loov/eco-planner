"use client"

import { storageConsent, allowStorage, clearStorage } from "@/functions/localStorage";
import { useEffect, useState } from "react";
import { getStoredGraphType } from "../graphs/functions/graphFunctions";
import { GraphType } from "../graphs/graphGraph";

export default function GraphCookie() {

    const [storageAllowed, setStorageAllowed] = useState(false)
  
    useEffect(() => {
      setStorageAllowed(storageConsent())
    }, [])
    
    return (
        <label>
            <input type="checkbox" id="allowStorage" checked={storageAllowed} onChange={e => {
            if (e.target.checked) {
                setStorageAllowed(true);
                allowStorage();
            } else {
                setStorageAllowed(false);
                clearStorage();
            }
            }} />
            Spara framtida vyändringar mellan sessioner och sidnavigeringar
        </label>
    )
}