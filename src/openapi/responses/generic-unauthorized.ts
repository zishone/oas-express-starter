export const genericUnauthorized = {
  description: '401 Unauthorized',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/genericFailResponse',
      },
    },
  },
};
