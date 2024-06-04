'use client'

import { AccessControlled } from "@/types";
import { Fragment, useRef, useState } from "react";
import Image from "next/image";
import styles from './accessSelector.module.css' with { type: "css" };

export default function AccessSelector({ groupOptions, currentAccess }: { groupOptions: string[], currentAccess?: AccessControlled | undefined }) {
  return (
    <>
      <p>För att lägga till en användare/grupp, skriv in namnet och tryck på enter.</p>
      <div className="margin-y-75">
        <ViewUsers groupOptions={groupOptions} existingGroups={currentAccess?.viewGroups.map((group) => { return group.name })} isPublic={currentAccess?.isPublic} />
      </div>
      <div className="margin-y-75">
        <EditUsers existingUsers={currentAccess?.editors.map((editor) => { return editor.username })} groupOptions={groupOptions} existingGroups={currentAccess?.editGroups.map((group) => { return group.name })} />
      </div>
    </>
  )
}

/**
 * Converts the form data to a JSON object that can be sent to the API.
 * @param formElements The form elements to convert to JSON.
 */
export function getAccessData(editUsers: RadioNodeList | Element | null, viewUsers: RadioNodeList | Element | null, editGroups: RadioNodeList | Element | null, viewGroups: RadioNodeList | Element | null) {
  const editUsersValue: string[] = [];
  const viewUsersValue: string[] = [];
  const editGroupsValue: string[] = [];
  const viewGroupsValue: string[] = [];

  if (editUsers instanceof RadioNodeList) {
    for (const i of editUsers) {
      if (i instanceof HTMLInputElement && i.value) {
        editUsersValue.push(i.value);
      }
    }
  } else if (editUsers instanceof HTMLInputElement && editUsers.value) {
    editUsersValue.push(editUsers.value);
  }

  if (viewUsers instanceof RadioNodeList) {
    for (const i of viewUsers) {
      if (i instanceof HTMLInputElement && i.value) {
        viewUsersValue.push(i.value);
      }
    }
  } else if (viewUsers instanceof HTMLInputElement && viewUsers.value) {
    viewUsersValue.push(viewUsers.value);
  }

  if (editGroups instanceof RadioNodeList) {
    for (const i of editGroups) {
      if (i instanceof HTMLInputElement && i.checked) {
        editGroupsValue.push(i.value);
      }
    }
  } else if (editGroups instanceof HTMLInputElement && editGroups.checked) {
    editGroupsValue.push(editGroups.value);
  }

  if (viewGroups instanceof RadioNodeList) {
    for (const i of viewGroups) {
      if (i instanceof HTMLInputElement && i.checked) {
        viewGroupsValue.push(i.value);
      }
    }
  } else if (viewGroups instanceof HTMLInputElement && viewGroups.checked) {
    viewGroupsValue.push(viewGroups.value);
  }

  return {
    editUsers: editUsersValue,
    viewUsers: viewUsersValue,
    editGroups: editGroupsValue,
    viewGroups: viewGroupsValue,
  }
}

/**
 * A somewhat generic function for handling keydown events on text fields.
 * @param event The event that triggered the function, should be a keydown event.
 * @param selectedOptions A list with the currently selected users/groups, should be a state variable.
 * @param selectedSetter The function to set `selectedOptions` to a new value, should be a state setter.
 * @param allOptions A list with the available users/groups. Is modified in-place if supplied.
 */
function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>, selectedOptions: string[], selectedSetter: React.Dispatch<React.SetStateAction<string[]>>, allOptions?: string[]) {
  if (event.key === 'Enter' && event.currentTarget.value !== '') {
    addUser(event.currentTarget.value, selectedOptions, selectedSetter, allOptions)
    // Clear the text field
    event.currentTarget.value = '';
  }
}

function addUser(name: string | undefined, selectedOptions: string[], selectedSetter: React.Dispatch<React.SetStateAction<string[]>>, allOptions?: string[]) {
  if (!name) return;
  // Add the new user to the list of selected users
  selectedSetter([...selectedOptions, name]);
  if (allOptions) {
    // Add the new user to the list of options
    allOptions.push(name);
  }
}

export function EditUsers({ existingUsers, groupOptions, existingGroups }: { existingUsers?: string[], groupOptions: string[], existingGroups?: string[] }) {
  // The users that have editing access to the item
  const [editUsers, setEditUsers] = useState<string[]>(existingUsers ?? []);

  // Add existing groups with access to the list of options, in case they are not already there
  let groups = [...groupOptions, ...existingGroups ?? []]
  // Remove duplicates
  groups = groups.filter((group, index) => groups.indexOf(group) === index)

  const editorRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <p><strong>Grupper med redigeringsbehörighet</strong></p>
      {groups.map((group) => (
        <Fragment key={'viewGroup' + group}>
          <label className="display-flex align-items-center gap-50 margin-y-50">
            <input type="checkbox" name="viewGroups" id={'viewGroup' + group} value={group} defaultChecked={existingGroups?.includes(group)} />
            {group}
          </label>
        </Fragment>
      ))}

      {/* A text field whose contents get appended to editUsers upon pressing enter */}

      <p style={{ marginTop: '3rem' }}><strong>Användare med redigeringsbehörighet</strong></p>
      <div className="flex align-items-flex-end margin-y-100 gap-100 flex-wrap-wrap">
        <label className="block flex-grow-100">
          Ny användare:
          <input style={{ marginTop: '.25rem' }} type="text" name="editUsers" ref={editorRef} id="newEditUser" onKeyDown={(event) => handleKeyDown(event, editUsers, setEditUsers)} />
        </label>

        <button type="button" style={{ fontSize: '1rem' }} onClick={() => { addUser(editorRef.current?.value, editUsers, setEditUsers); if (editorRef.current) editorRef.current.value = '' }}>Lägg till användare</button>
      </div>

      <section style={{ maxHeight: '300px', overflowY: 'scroll', scrollbarWidth: 'thin' }}>
        {editUsers.map((user, index) => (
          <Fragment key={'editUser' + index}>
            <label className="display-flex gap-100 align-items-center">
              <input className={styles.user} type="text" name="editUsers" id={'editUser' + user} value={user} onChange={(event) => {
                // Replace the user in the list of selected editUsers with the new value
                setEditUsers(editUsers.map((editUser) => editUser === user ? event.currentTarget.value : editUser));
              }} />
              {/* Remove the user from the list of selected editUsers */}
              <button
                onClick={() => { setEditUsers(editUsers.filter((editUser) => editUser !== user)); }}
                className={styles.removeUserButton}
                type="button">
                <Image src="/icons/delete.svg" alt="remove" width={24} height={24}></Image>
              </button>
            </label>
          </Fragment>
        ))}
      </section>

    </>
  )
}

export function ViewUsers({ existingUsers, groupOptions, existingGroups, isPublic }: { existingUsers?: string[], groupOptions: string[], existingGroups?: string[], isPublic?: boolean }) {
  // The users that have viewing access to the item
  const [viewUsers, setViewUsers] = useState<string[]>(existingUsers ?? []);

  // Add existing groups with access to the list of options, in case they are not already there
  let groups = [...groupOptions, ...existingGroups ?? []]
  // Remove duplicates
  groups = groups.filter((group, index) => groups.indexOf(group) === index)

  const viewRef = useRef<HTMLInputElement | null>(null)

  return (
    <div style={{ marginBottom: '3rem' }} >

      <label className="display-flex align-items-center gap-50 margin-y-50">
        <input type="checkbox" name="isPublic" id="isPublic" defaultChecked={isPublic} />
        <strong>Visa inlägg publikt</strong>
      </label>

      <p style={{ marginTop: '3rem' }}><strong>Grupper med läsbehörighet</strong></p>
      {groups.map((group) => (
        <Fragment key={'viewGroup' + group}>
          <label className="display-flex align-items-center gap-50 margin-y-50">
            <input type="checkbox" name="viewGroups" id={'viewGroup' + group} value={group} defaultChecked={existingGroups?.includes(group)} />
            {group}
          </label>
        </Fragment>
      ))}

      {/* A text field whose contents get appended to viewUsers upon pressing enter */}
      <p style={{ marginTop: '3rem' }}><strong>Användare med läsbehörighet</strong></p>
      <div className="flex align-items-flex-end gap-100 flex-wrap-wrap margin-y-100">
        <label className="block flex-grow-100">
          Ny användare:
          <input style={{ marginTop: '.25rem' }} type="text" name="viewUsers" id="newViewUser" ref={viewRef} onKeyDown={(event) => handleKeyDown(event, viewUsers, setViewUsers)} />
        </label>

        <button type="button" style={{ fontSize: '1rem' }} onClick={() => { addUser(viewRef.current?.value, viewUsers, setViewUsers); if (viewRef.current) viewRef.current.value = '' }}>Lägg till användare</button>
      </div>

      <section style={{ maxHeight: '300px', overflowY: 'scroll', scrollbarWidth: 'thin' }}>
        {viewUsers.map((user, index) => (
          <Fragment key={'viewUser' + index}>
            <label className="display-flex gap-100 align-items-center">
              <input className={styles.user} type="text" name="viewUsers" id={'viewUser' + user} value={user} onChange={(event) => {
                // Replace the user in the list of selected viewUsers with the new value
                setViewUsers(viewUsers.map((viewUser) => viewUser === user ? event.currentTarget.value : viewUser));
              }} />
              <button
                onClick={() => { setViewUsers(viewUsers.filter((viewUser) => viewUser !== user)); }}
                className={styles.removeUserButton}
                type="button">
                <Image src="/icons/delete.svg" alt="remove" width={24} height={24}></Image>
              </button>
            </label>
          </Fragment>
        ))}
      </section>

    </div>
  )
} 