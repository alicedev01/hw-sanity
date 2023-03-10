import sub from 'date-fns/sub'
import testSanityClient from '../../helpers/sanityClientSetUp'
import {createUniqueDocument} from '../../helpers/createUniqueDocument'

const getTestLocation = (documentId) =>
  `/test/desk/input-ci;conditionalFieldset;${documentId}%2Csince%3D%40lastPublished`

function deleteOldDocuments() {
  const timestampOneDayAgo = sub(new Date(), {days: -1}).toISOString()
  testSanityClient.delete({
    query: `*[_type == "conditionalFieldset" && dateTime(_updatedAt) < dateTime('${timestampOneDayAgo}') && title match "[Cypress]" &&]`,
  })
}

const TEST_CONFIG = {
  defaultCommandTimeout: 15000,
  viewportWidth: 2000,
  viewportHeight: 3500,
}

const doc = {
  _type: 'conditionalFieldset',
  title: 'Conditional fieldset [Cypress]',
  hidden: true,
  readOnly: true,
  // Multi
  multiHiddenBooleanFalse1: 'Lorem',
  multiHiddenBooleanFalse2: 'Lorem',
  multiHiddenBooleanTrue1: 'Lorem',
  multiHiddenBooleanTrue2: 'Lorem',
  multiHiddenCallbackFalse1: 'Lorem',
  multiHiddenCallbackFalse2: 'Lorem',
  multiHiddenCallbackTrue1: 'Lorem',
  multiHiddenCallbackTrue2: 'Lorem',
  multiReadOnlyBooleanFalse1: 'Lorem',
  multiReadOnlyBooleanFalse2: 'Lorem',
  multiReadOnlyBooleanTrue1: 'Lorem',
  multiReadOnlyBooleanTrue2: 'Lorem',
  multiReadOnlyCallbackFalse1: 'Lorem',
  multiReadOnlyCallbackFalse2: 'Lorem',
  multiReadOnlyCallbackTrue1: 'Lorem',
  multiReadOnlyCallbackTrue2: 'Lorem',
  // Single
  singleHiddenBooleanFalse1: 'Lorem',
  singleHiddenBooleanTrue1: 'Lorem',
  singleHiddenCallbackFalse1: 'Lorem',
  singleHiddenCallbackTrue1: 'Lorem',
  singleReadOnlyBooleanFalse1: 'Lorem',
  singleReadOnlyBooleanTrue1: 'Lorem',
  singleReadOnlyCallbackFalse1: 'Lorem',
  singleReadOnlyCallbackTrue1: 'Lorem',
}

const waitForReviewChanges = () => {
  // Sometimes it takes a while for Review Changes to appear when loading the page.
  // This prevents the test from failing randomly
  cy.get('[data-testid="review-changes-pane"]', {timeout: 10000}).should('be.visible')
}

const ensureCorrectUri = (checkLocation) => {
  cy.location('pathname').should('eq', checkLocation)
}

const getTestLocationUri = async () => {
  const testDoc = await createUniqueDocument(doc)
  return getTestLocation(testDoc?._id)
}

describe('@sanity/field: Multi fieldset and review changes', TEST_CONFIG, () => {
  let testLocation
  let alreadyOnLocation = false

  before(async () => {
    deleteOldDocuments()
    testLocation = await getTestLocationUri()
  })

  beforeEach(() => {
    if (!alreadyOnLocation) {
      cy.visit(testLocation)
      waitForReviewChanges()
      alreadyOnLocation = true
    }

    ensureCorrectUri(testLocation)
  })

  // Hidden boolean false
  it('when hidden property is false, the fieldset is rendered', () => {
    cy.get('[data-testid="fieldset-multiHiddenBooleanFalse"]').should('be.visible')
  })

  // Hidden boolean true
  it('when hidden property is true, the fieldset is not rendered', () => {
    cy.get('[data-testid="fieldset-multiHiddenBooleanTrue"]').should('not.exist')
  })

  // Hidden callback (document) false
  it('when the hidden callback (document) returns false, the fieldset is rendered', () => {
    cy.get('[data-testid="fieldset-multiHiddenCallbackFalse"]').should('be.visible')
  })

  // Hidden callback (document) true
  it('when the hidden callback (document) returns true, the fieldset is not rendered', () => {
    cy.get('[data-testid="fieldset-multiHiddenCallbackTrue"]').should('not.exist')
  })

  // Read only boolean false
  it('when the readOnly property is false, the fieldset is enabled', () => {
    cy.get('[data-testid="fieldset-multiReadOnlyBooleanFalse"]')
      .find('input')
      .should('not.have.attr', 'readonly')
  })

  // Read only boolean true
  it('when the readOnly property is true, the fieldset is disabled', () => {
    cy.get('[data-testid="fieldset-multiReadOnlyBooleanTrue"]')
      .find('input')
      .should('have.attr', 'readonly')
  })

  // Read only callback (document) false
  it('when the readOnly callback (document) returns false, the fieldset is enabled', () => {
    cy.get('[data-testid="fieldset-multiReadOnlyCallbackFalse"]')
      .find('input')
      .should('not.have.attr', 'readonly')
  })

  // Read only callback (document) true
  it('when the readOnly callback (document) returns true, the fieldset is disabled', () => {
    cy.get('[data-testid="fieldset-multiReadOnlyCallbackTrue"]')
      .find('input')
      .should('have.attr', 'readonly')
  })

  // eslint-disable-next-line no-warning-comments
  /* @TODO
  - when readOnly callback (parent) returns false, the fieldset is not disabled
  - when readOnly callback (parent) returns false, the fieldset is not disabled
  - when readOnly callback (parent) returns true, the fieldset is disabled
  - when readOnly callback (currentUser) returns false, the fieldset is not disabled
  - when readOnly callback (currentUser) returns true, the fieldset is disabled
  - when readOnly callback (value) returns false, the fieldset is not disabled
  - when readOnly callback (value) returns true, the fieldset is disabled
  - when hidden callback (parent) returns true, the fieldset is not rendered
  - when hidden callback (parent) returns false, the fieldset is rendered
  - when hidden callback (currentUser) returns false, the fieldset is rendered
  - when hidden callback (currentUser) returns true, the fieldset is not rendered
  - when hidden callback (value) returns false, the fieldset is rendered
  - when hidden callback (value) returns true, the fieldset is not rendered
  */

  /* --- Review Changes --- */

  // Hidden boolean false
  it('when hidden property is false, the review change for fieldset is rendered', () => {
    cy.get('[data-testid="group-change-multiHiddenBooleanFalse"]').should('be.visible')
  })

  // Hidden boolean true
  it('when hidden property is true, the review change for fieldset is not rendered', () => {
    cy.get('[data-testid="group-change-multiHiddenBooleanTrue"]').should('not.exist')
  })

  // Hidden callback (document) false
  it('when the hidden callback (document) returns false, the review change for fieldset is rendered', () => {
    cy.get('[data-testid="group-change-multiHiddenCallbackFalse"]').should('be.visible')
  })

  // Hidden callback (document) true
  it('when the hidden callback (document) returns true, the review change for fieldset is not rendered', () => {
    cy.get('[data-testid="group-change-multiHiddenCallbackTrue"]').should('not.exist')
  })

  // Read only boolean false
  it('when the readOnly property is false, the review change for fieldset is enabled', () => {
    cy.get('[data-testid="group-change-revert-button-multiReadOnlyBooleanFalse"]').should(
      'not.be.disabled'
    )

    cy.get('[data-testid="single-change-revert-button-multiReadOnlyBooleanFalse1"').should(
      'not.be.disabled'
    )
    cy.get('[data-testid="single-change-revert-button-multiReadOnlyBooleanFalse2"').should(
      'not.be.disabled'
    )
  })

  // Read only boolean true
  it('when the readOnly property is true, the review change for fieldset is disabled', () => {
    cy.get('[data-testid="group-change-revert-button-multiReadOnlyBooleanTrue"]').should(
      'be.disabled'
    )

    cy.get('[data-testid="single-change-revert-button-multiReadOnlyBooleanTrue1"').should(
      'be.disabled'
    )
    cy.get('[data-testid="single-change-revert-button-multiReadOnlyBooleanTrue2"').should(
      'be.disabled'
    )
  })

  // Read only callback (document) false
  it('when the readOnly callback (document) returns false, the review change for fieldset is enabled', () => {
    cy.get('[data-testid="group-change-revert-button-multiReadOnlyCallbackFalse"]').should(
      'not.be.disabled'
    )

    cy.get('[data-testid="single-change-revert-button-multiReadOnlyCallbackFalse1"').should(
      'not.be.disabled'
    )
    cy.get('[data-testid="single-change-revert-button-multiReadOnlyCallbackFalse2"').should(
      'not.be.disabled'
    )
  })

  // Read only callback (document) true
  it('when the readOnly callback (document) returns true, the review change for fieldset is disabled', () => {
    cy.get('[data-testid="group-change-revert-button-multiReadOnlyCallbackTrue"]').should(
      'be.disabled'
    )

    cy.get('[data-testid="single-change-revert-button-multiReadOnlyCallbackTrue1"').should(
      'be.disabled'
    )
    cy.get('[data-testid="single-change-revert-button-multiReadOnlyCallbackTrue2"').should(
      'be.disabled'
    )
  })

  // eslint-disable-next-line no-warning-comments
  /* @TODO

  - when readOnly callback (parent) returns false, the review change for fieldset is not disabled
  - when readOnly callback (parent) returns true, the review change for fieldset is disabled
  - when readOnly callback (currentUser) returns false, the review change for fieldset is not disabled
  - when readOnly callback (currentUser) returns true, the review change for fieldset is disabled
  - when readOnly callback (value) returns false, the review change for fieldset is not disabled
  - when readOnly callback (value) returns true, the review change for fieldset is disabled
  - when hidden callback (parent) returns true, the review change for fieldset is not rendered
  - when hidden callback (parent) returns false, the review change for fieldset is rendered
  - when hidden callback (currentUser) returns false, the review change for fieldset is rendered
  - when hidden callback (currentUser) returns true, the review change for fieldset is not rendered
  - when hidden callback (value) returns false, the review change for fieldset is rendered
  - when hidden callback (value) returns true, the review change for fieldset is not rendered'
  */
})

describe('@sanity/field: Single fieldset and review changes', TEST_CONFIG, () => {
  let testLocation
  let alreadyOnLocation = false

  before(async () => {
    testLocation = await getTestLocationUri()
  })

  beforeEach(() => {
    if (!alreadyOnLocation) {
      cy.visit(testLocation)
      waitForReviewChanges()
      alreadyOnLocation = true
    }

    ensureCorrectUri(testLocation)
  })

  // Hidden boolean false
  it('when hidden property is false, the fieldset is rendered', () => {
    cy.get('[data-testid="fieldset-singleHiddenBooleanFalse"]').should('be.visible')
  })

  // Hidden boolean true
  it('when hidden property is true, the fieldset is not rendered', () => {
    cy.get('[data-testid="fieldset-singleHiddenBooleanTrue"]').should('not.exist')
  })

  // Hidden callback (document) false
  it('when hidden callback (document) returns false, the fieldset is rendered', () => {
    cy.get('[data-testid="fieldset-singleHiddenCallbackFalse"]').should('be.visible')
  })

  // Hidden callback (document) true
  it('when hidden callback (document) returns true, the fieldset is not rendered', () => {
    cy.get('[data-testid="fieldset-singleHiddenCallbackTrue"]').should('not.exist')
  })

  // Read only boolean false
  it('when readOnly property is false, the fieldset is enabled', () => {
    cy.get('[data-testid="fieldset-singleReadOnlyBooleanFalse"]')
      .find('input')
      .should('not.have.attr', 'readonly')
  })

  // Read only boolean true
  it('when readOnly property is true, the fieldset is disabled', () => {
    cy.get('[data-testid="fieldset-singleReadOnlyBooleanTrue"]')
      .find('input')
      .should('have.attr', 'readonly')
  })

  // Read only callback (document) false
  it('when readOnly callback (document) returns false, the fieldset is not disabled', () => {
    cy.get('[data-testid="fieldset-singleReadOnlyCallbackFalse"]')
      .find('input')
      .should('not.have.attr', 'readonly')
  })

  // Read only callback (document) true
  it('when readOnly callback (document) returns true, the fieldset is disabled', () => {
    cy.get('[data-testid="fieldset-singleReadOnlyCallbackTrue"]')
      .find('input')
      .should('have.attr', 'readonly')
  })

  // eslint-disable-next-line no-warning-comments
  /* @TODO
  - when readOnly callback (parent) returns false, the fieldset is not disabled
  - when readOnly callback (parent) returns false, the fieldset is not disabled
  - when readOnly callback (parent) returns true, the fieldset is disabled
  - when readOnly callback (currentUser) returns false, the fieldset is not disabled
  - when readOnly callback (currentUser) returns true, the fieldset is disabled
  - when readOnly callback (value) returns false, the fieldset is not disabled
  - when readOnly callback (value) returns true, the fieldset is disabled
  - when hidden callback (parent) returns true, the fieldset is not rendered
  - when hidden callback (parent) returns false, the fieldset is rendered
  - when hidden callback (currentUser) returns false, the fieldset is rendered
  - when hidden callback (currentUser) returns true, the fieldset is not rendered
  - when hidden callback (value) returns false, the fieldset is rendered
  - when hidden callback (value) returns true, the fieldset is not rendered
  */

  /* --- Review Changes --- */

  // Hidden boolean false
  it('when hidden property is false, the review change for fieldset is rendered', () => {
    cy.get('[data-testid="single-change-revert-button-singleHiddenBooleanFalse1"').should(
      'be.visible'
    )
  })

  // Hidden boolean true
  it('when hidden property is true, the review change for fieldset is not rendered', () => {
    cy.get('[data-testid="single-change-revert-button-singleHiddenBooleanTrue1"').should(
      'not.exist'
    )
  })

  // Hidden callback (document) false
  it('when hidden callback (document) returns false, the review change for fieldset is rendered', () => {
    cy.get('[data-testid="single-change-revert-button-singleHiddenCallbackFalse1"').should(
      'be.visible'
    )
  })

  // Hidden callback (document) true
  it('when hidden callback (document) returns true, the review change for fieldset is not rendered', () => {
    cy.get('[data-testid="single-change-revert-button-singleHiddenCallbackTrue1"').should(
      'not.exist'
    )
  })

  // Read only boolean false
  it('when readOnly property is false, the review change for fieldset is enabled', () => {
    cy.get('[data-testid="single-change-revert-button-singleReadOnlyBooleanFalse1"').should(
      'not.be.disabled'
    )
  })

  // Read only boolean true
  it('when readOnly property is true, the review change for fieldset is disabled', () => {
    cy.get('[data-testid="single-change-revert-button-singleReadOnlyBooleanTrue1"').should(
      'be.disabled'
    )
  })

  // Read only callback (document) false
  it('when readOnly callback (document) (document) returns false, the review change for fieldset is not disabled', () => {
    cy.get('[data-testid="single-change-revert-button-singleReadOnlyCallbackFalse1"').should(
      'not.be.disabled'
    )
  })

  // Read only callback (document) true
  it('when readOnly callback (document) returns true, the review change for fieldset is disabled', () => {
    cy.get('[data-testid="single-change-revert-button-singleReadOnlyCallbackTrue1"').should(
      'be.disabled'
    )
  })

  // eslint-disable-next-line no-warning-comments
  /* @TODO

  - when readOnly callback (parent) returns false, the review change for fieldset is not disabled
  - when readOnly callback (parent) returns true, the review change for fieldset is disabled
  - when readOnly callback (currentUser) returns false, the review change for fieldset is not disabled
  - when readOnly callback (currentUser) returns true, the review change for fieldset is disabled
  - when readOnly callback (value) returns false, the review change for fieldset is not disabled
  - when readOnly callback (value) returns true, the review change for fieldset is disabled
  - when hidden callback (parent) returns true, the review change for fieldset is not rendered
  - when hidden callback (parent) returns false, the review change for fieldset is rendered
  - when hidden callback (currentUser) returns false, the review change for fieldset is rendered
  - when hidden callback (currentUser) returns true, the review change for fieldset is not rendered
  - when hidden callback (value) returns false, the review change for fieldset is rendered
  - when hidden callback (value) returns true, the review change for fieldset is not rendered'
  */
})
