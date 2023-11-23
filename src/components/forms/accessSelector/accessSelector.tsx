'use client'

import { AccessControlled } from "@/types";
import { Fragment, useState } from "react";
import Image from "next/image";
import styles from './accessSelector.module.css'

export default function AccessSelector({ groupOptions, currentAccess }: { groupOptions: string[], currentAccess?: AccessControlled | undefined }) {
  // In case the groupOptions prop includes 'Public', remove it; it should never have editing access to an item
  groupOptions = groupOptions.filter((group) => group !== 'Public')

  return (
    <>
      <details open>
        <summary>Redigera behörigheter</summary>
        <p>
          För att lägga till en användare/grupp, skriv in namnet och tryck på enter.<br />
          För att ta bort en användare/grupp, checka ur rutan bredvid namnet.<br />
        </p>

        <div className="grid-auto-rows">
          <EditUsers existingUsers={currentAccess?.editors.map((editor) => { return editor.username })} />
          <ViewUsers existingUsers={currentAccess?.viewers.map((viewer) => { return viewer.username })} />
          <EditGroups groupOptions={groupOptions} existingGroups={currentAccess?.editGroups.map((group) => { return group.name })} />
          <ViewGroups groupOptions={[...groupOptions, 'Public']} existingGroups={currentAccess?.viewGroups.map((group) => { return group.name })} />
        </div>
      </details>
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
    // Add the new user to the list of selected users
    selectedSetter([...selectedOptions, event.currentTarget.value]);
    if (allOptions) {
      // Add the new user to the list of options
      allOptions.push(event.currentTarget.value);
    }
    // Clear the text field
    event.currentTarget.value = '';
  }
}

function EditUsers({ existingUsers }: { existingUsers?: string[] }) {
  // The users that have editing access to the item
  const [editUsers, setEditUsers] = useState<string[]>(existingUsers ?? []);

  return (
    <fieldset>
      <legend>Användare med redigeringsbehörighet</legend>
      {editUsers.map((user, index) => (
        <Fragment key={'editUser' + index}>
          <label className="display-flex gap-100 align-items-center">
            <input type="text" name="editUsers" id={'editUser' + user} value={user} onChange={(event) => {
              // Replace the user in the list of selected editUsers with the new value
              setEditUsers(editUsers.map((editUser) => editUser === user ? event.currentTarget.value : editUser));
            }} />
            {/* Remove the user from the list of selected editUsers */}
            <button
              onClick={() => { setEditUsers(editUsers.filter((editUser) => editUser !== user)); }}
              className={styles.removeUserButton}
              type="button">
              <Image src="/icons/close.svg" alt="remove" width={16} height={16}></Image>
            </button>
          </label>
        </Fragment>
      ))}
      {/* A text field whose contents get appended to editUsers upon pressing enter */}
      <label className="block" htmlFor="newEditUser">Ny användare: </label>
      <input type="text" name="editUsers" id="newEditUser" onKeyDown={(event) => handleKeyDown(event, editUsers, setEditUsers)} />
    </fieldset>
  )
}

function ViewUsers({ existingUsers }: { existingUsers?: string[] }) {
  // The users that have viewing access to the item
  const [viewUsers, setViewUsers] = useState<string[]>(existingUsers ?? []);

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
              <Image src="/icons/close.svg" alt="remove" width={16} height={16}></Image>
            </button>
          </label>
        </Fragment>
      ))}
      {/* A text field whose contents get appended to viewUsers upon pressing enter */}
      <label className="block" htmlFor="newViewUser">Ny användare: </label>
      <input type="text" name="viewUsers" id="newViewUser" onKeyDown={(event) => handleKeyDown(event, viewUsers, setViewUsers)} />
    </fieldset>
  )
}

function EditGroups({ groupOptions, existingGroups }: { groupOptions: string[], existingGroups?: string[] }) {
  // The 'Public' group should never have editing access to an item
  let groups = groupOptions.filter((group) => group !== 'Public')

  return (
    <fieldset>
      <legend>Grupper med redigeringsbehörighet</legend>
      {groups.map((group) => (
        <Fragment key={'editGroup' + group}>
          <input type="checkbox" name="editGroups" id={'editGroup' + group} value={group} defaultChecked={existingGroups?.includes(group)} />
          <label htmlFor={'editGroup' + group}>{group}</label>
          <br />
        </Fragment>
      ))}
    </fieldset>
  );
}

function ViewGroups({ groupOptions, existingGroups }: { groupOptions: string[], existingGroups?: string[] }) {
  let groups = groupOptions

  return (
    <fieldset>
      <legend>Grupper med läsbehörighet</legend>
      {groups.map((group) => (
        <Fragment key={'viewGroup' + group}>
          <input type="checkbox" name="viewGroups" id={'viewGroup' + group} value={group} defaultChecked={existingGroups?.includes(group)} />
          <label htmlFor={'viewGroup' + group}>{group}</label>
          <br />
        </Fragment>
      ))}
    </fieldset>
  );
}