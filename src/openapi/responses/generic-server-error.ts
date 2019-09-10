export const genericServerError = {
  description: '5XX Server Error',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/genericErrorResponse',
      },
    },
  },
};
