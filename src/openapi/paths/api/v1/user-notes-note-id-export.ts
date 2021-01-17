import { OpenAPIV3 } from 'openapi-types';

export const userNotesNoteIdExportV1: OpenAPIV3.PathItemObject = {
  get: {
    tags: ['User Notes'],
    operationId: 'getUserNotesNoteIdExportV1',
    description: "Exports authenticated user's note as csv",
    security: [{ loginAuth: [] }],
    parameters: [{ $ref: '#/components/parameters/noteId' }, { $ref: '#/components/parameters/fields' }],
    responses: {
      ['200']: {
        description: 'Success',
        content: {
          ['text/csv']: {
            schema: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
      ['2XX']: { $ref: '#/components/responses/genericSuccess' },
      ['3XX']: { $ref: '#/components/responses/genericRedirect' },
      ['4XX']: { $ref: '#/components/responses/genericFail' },
      ['5XX']: { $ref: '#/components/responses/genericError' },
      default: { $ref: '#/components/responses/generic' },
    },
  },
};
