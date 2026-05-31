export const MEMO_DRAFT_KEY = 'memo-draft-v1'

export enum MemoPageMode {
  Edit = 'edit',
  Create = 'create',
}

function getTabDraftKey(): string {
  const SESSION_KEY = 'tab-session-id'
  let tabId = sessionStorage.getItem(SESSION_KEY)
  if (!tabId) {
    tabId = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, tabId)
  }
  return `${MEMO_DRAFT_KEY}-${tabId}`
}

export const TAB_DRAFT_KEY = getTabDraftKey()
