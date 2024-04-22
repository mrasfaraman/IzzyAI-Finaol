import React, {createContext, useState, useContext} from 'react';

// Step 1: Define the context
const DataContext = createContext();

// Step 2: Create a provider component
export const DataProvider = ({children}) => {
  const [articulationReport, setArticulationReport] = useState([]);
  const [exercisesReport, setExercisesReport] = useState([]);
  const [totalQuestion, setTotalQuestion] = useState();

  const [userId, setUserId] = useState('');
  const [userDetail, setUserDetail] = useState({
    UserID: '',
    FullName: '',
    Age: '',
    Gender: '',
    AvatarID: '',
    FaceAuthenticationState: null,
    checkboxes: [],
    email: '',
    avatarUrl: '',
    totalQuestion: 0,
  });

  const updateUserId = newUserId => {
    setUserId(newUserId);
  };

  const updateUserDetail = newUserDetail => {
    setUserDetail(prevUserDetail => ({
      ...prevUserDetail,
      ...newUserDetail,
    }));
  };

  return (
    <DataContext.Provider
      value={{
        articulationReport,
        setArticulationReport,
        exercisesReport,
        setExercisesReport,
        userId,
        updateUserId,
        updateUserDetail,
        userDetail,
      }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the global context
export const useDataContext = () => useContext(DataContext);
