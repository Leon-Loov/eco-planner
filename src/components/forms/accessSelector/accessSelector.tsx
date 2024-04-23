'use client'

import { AccessControlled } from "@/types";
import { Fragment, useRef, useState } from "react";
import Image from "next/image";
import styles from './accessSelector.module.css' with { type: "css" };

export default function AccessSelector({ groupOptions, currentAccess }: { groupOptions: string[], currentAccess?: AccessControlled | undefined }) {
  // In case the groupOptions prop includes 'Public', remove it; it should never have editing access to an item
  groupOptions = groupOptions.filter((group) => group !== 'Public')

  return (
    <>
      <p>För att lägga till en användare/grupp, skriv in namnet och tryck på enter.</p>
      <div className="margin-y-75">
        <EditUsers existingUsers={currentAccess?.editors.map((editor) => { return editor.username })} groupOptions={groupOptions} existingGroups={currentAccess?.editGroups.map((group) => { return group.name })} />
      </div>
      <div className="margin-y-75">
        <ViewUsers groupOptions={[...groupOptions, 'Public']} existingGroups={currentAccess?.viewGroups.map((group) => { return group.name })} />
      </div>
    </>
  )
}

/**
 * Converts the form data to a JSON object that can be sent to the API.
 * @param formElements The form elements to convert to JSON.
 */
export function getAccessData(editUsers: RadioNodeList | Element | null, viewUsers: RadioNodeList | Element | null, editGroups: RadioNodeList | Element | null, viewGroups: RadioNodeList | Element | null) {
  let editUsersValue: string[] = [];
  let viewUsersValue: string[] = [];
  let editGroupsValue: string[] = [];
  let viewGroupsValue: string[] = [];

  if (editUsers instanceof RadioNodeList) {
    for (let i of editUsers) {
      if (i instanceof HTMLInputElement && i.value) {
        editUsersValue.push(i.value);
      }
    }
  } else if (editUsers instanceof HTMLInputElement && editUsers.value) {
    editUsersValue.push(editUsers.value);
  }

  if (viewUsers instanceof RadioNodeList) {
    for (let i of viewUsers) {
      if (i instanceof HTMLInputElement && i.value) {
        viewUsersValue.push(i.value);
      }
    }
  } else if (viewUsers instanceof HTMLInputElement && viewUsers.value) {
    viewUsersValue.push(viewUsers.value);
  }

  if (editGroups instanceof RadioNodeList) {
    for (let i of editGroups) {
      if (i instanceof HTMLInputElement && i.checked) {
        editGroupsValue.push(i.value);
      }
    }
  } else if (editGroups instanceof HTMLInputElement && editGroups.checked) {
    editGroupsValue.push(editGroups.value);
  }

  if (viewGroups instanceof RadioNodeList) {
    for (let i of viewGroups) {
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
  if(!name) return;
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
  // The 'Public' group should never have editing access to an item
  let groups = groupOptions.filter((group) => group !== 'Public')
  
  let editorRef = useRef<HTMLInputElement | null>(null)

  return (
    <fieldset>
      <legend>Användare med redigeringsbehörighet</legend>

      {groups.map((group) => (
        <Fragment key={'viewGroup' + group}>
          <label className="display-flex align-items-center gap-50 margin-y-50">
            <input type="checkbox" name="viewGroups" id={'viewGroup' + group} value={group} defaultChecked={existingGroups?.includes(group)} />
            {group}
          </label>
        </Fragment>
      ))}

      {/* A text field whose contents get appended to editUsers upon pressing enter */}
      <div className="flex align-items-flex-end margin-y-75 gap-100 flex-wrap-wrap">
        <label className="block flex-grow-100">
          Ny användare: 
          <input style={{marginTop: '.25rem'}} type="text" name="editUsers" ref={editorRef} id="newEditUser" onKeyDown={(event) => handleKeyDown(event, editUsers, setEditUsers)} />
        </label>

        <button style={{fontSize: '1rem'}} onClick={() => {addUser(editorRef.current?.value, editUsers, setEditUsers); if(editorRef.current) editorRef.current.value = ''}}>Lägg till användare</button>
      </div>


      {editUsers.map((user, index) => (
        <Fragment key={'editUser' + index}>
          <label className="display-flex gap-100 align-items-center">
            <input className={styles.editUser} type="text" name="editUsers" id={'editUser' + user} value={user} onChange={(event) => {
              // Replace the user in the list of selected editUsers with the new value
              setEditUsers(editUsers.map((editUser) => editUser === user ? event.currentTarget.value : editUser));
            }} />
            {/* Remove the user from the list of selected editUsers */}
            <button
              onClick={() => { setEditUsers(editUsers.filter((editUser) => editUser !== user)); }}
              className={styles.removeUserButton}
              type="button">
              <Image src="/icons/plus.svg" alt="remove" width={24} height={24}></Image>
            </button>
          </label>
        </Fragment>
      ))}

    </fieldset>
  )
}

export function ViewUsers({ existingUsers, groupOptions, existingGroups }: { existingUsers?: string[], groupOptions: string[], existingGroups?: string[] }) {
  // The users that have viewing access to the item
  const [viewUsers, setViewUsers] = useState<string[]>(existingUsers ?? []);
  let groups = groupOptions

  return (
    <fieldset>
      <legend>Användare med läsbehörighet</legend>
      {viewUsers.map((user, index) => (
        <Fragment key={'viewUser' + index}>
          <label className="display-flex gap-100 align-items-center">
            <input type="text" name="viewUsers" id={'viewUser' + user} value={user} onChange={(event) => {
              // Replace the user in the list of selected viewUsers with the new value
              setViewUsers(viewUsers.map((viewUser) => viewUser === user ? event.currentTarget.value : viewUser));
            }} />
            <button
              onClick={() => { setViewUsers(viewUsers.filter((viewUser) => viewUser !== user)); }}
              className={styles.removeUserButton}
              type="button">
              <Image src="/icons/plus.svg" alt="remove" width={24} height={24}></Image>
            </button>
          </label>
        </Fragment>
      ))}
      {/* A text field whose contents get appended to viewUsers upon pressing enter */}
      <label className="block margin-y-75">
        Ny användare: 
        <input className="margin-y-25" type="text" name="viewUsers" id="newViewUser" onKeyDown={(event) => handleKeyDown(event, viewUsers, setViewUsers)} />
      </label>
      {groups.map((group) => (
        <Fragment key={'viewGroup' + group}>
          <label className="display-flex align-items-center gap-50 margin-y-50">
            <input type="checkbox" name="viewGroups" id={'viewGroup' + group} value={group} defaultChecked={existingGroups?.includes(group)} />
            {group}
          </label>
        </Fragment>
      ))}
    </fieldset>
  )
} 