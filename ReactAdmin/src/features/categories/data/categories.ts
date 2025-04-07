export const Categories: Category = {
  id: 1,
  name: 'Electronics',
  description: "",      // Use empty string instead of null
  status: 'active',
  parentId: null,       // Adjust if needed: see Option 2 for parentId too.
  children: [
    {
      id: 2,
      name: 'Computers',
      description: "",  // Use empty string
      status: 'active',
      parentId: 1,
      children: [
        {
          id: 3,
          name: 'Laptops',
          description: "", // Use empty string
          status: 'inactive',
          parentId: 2,
          children: [],
        },
      ],
    },
  ],
};
