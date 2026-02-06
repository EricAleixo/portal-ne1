export type CreateUserBody = {
  user: {
    name: string;
    password: string;
  };
};

export type LoginBody = {
  user: {
    name: string;
    password: string;
  };
};
