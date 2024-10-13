export const setStateAsync = <S>(
  setter: React.Dispatch<React.SetStateAction<S>>
): Promise<S> => {
  return new Promise((resolve) => {
    setter((prevState) => {
      resolve(prevState);
      return prevState;
    });
  });
};
