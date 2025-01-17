import { useState, useEffect } from 'react';
import { listItem } from './types/listTypes';
import {
  ListItems,
  FormItems,
  TrashBtn,
  AllDone,
  Modal,
  WhatsAppBtn,
} from './components';
import { useTranslation } from 'react-i18next';
import ToggleBox from './components/ToggleBox';

function App() {
  const [listItems, setListItems] = useState<listItem[]>(
    localStorage.items ? JSON.parse(localStorage.items) : [],
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLightMode, setIsLightMode] = useState<boolean>(
    localStorage.isLightMode ? JSON.parse(localStorage.isLightMode) : false,
  );
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(
    localStorage.direction ? JSON.parse(localStorage.direction) : 'rtl',
  );

  const { i18n, t } = useTranslation();

  useEffect(() => {
    localStorage.items = JSON.stringify(listItems);
  }, [listItems]);

  useEffect(() => {
    localStorage.direction = JSON.stringify(direction);
    i18n.changeLanguage(direction === 'rtl' ? 'he' : 'en');
  }, [direction]);

  useEffect(() => {
    localStorage.isLightMode = JSON.stringify(isLightMode);
  }, [isLightMode]);

  const handlePress = (id: number, btnState: boolean) => {
    const arr = listItems.map((item) =>
      item.id === id ? { ...item, isChecked: btnState } : item,
    );
    setListItems(arr);
  };

  const handleAddItem = (name: string, quantity: number) => {
    const itemIndex = listItems.findIndex(
      (itemName) =>
        itemName.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
    if (itemIndex === -1) {
      setListItems((prev) => [
        {
          id: Date.now(),
          name,
          quantity,
          isChecked: false,
        },
        ...prev,
      ]);
    } else {
      const newArr = listItems.map((item, index) => {
        if (index !== itemIndex) {
          return item;
        } else {
          return {
            ...item,
            quantity: item.quantity + quantity,
          };
        }
      });
      setListItems(newArr);
    }
  };

  const changeDirection = () => {
    setDirection(direction === 'ltr' ? 'rtl' : 'ltr');
  };

  return (
    <div
      className={`min-h-screen ${
        isLightMode ? 'text-gray-950  bg-[wheat]' : 'bg-zinc-800  text-white'
      } flex flex-col items-center flex-1 relative`}
    >
      <ToggleBox
        changeDirection={changeDirection}
        isLightMode={isLightMode}
        setIsLightMode={setIsLightMode}
        direction={direction}
      />
      <div className='mx-auto container px-4 pt-4 mb-[60px] pb-[60px] md:w-[600px] '>
        <h1 className='text-4xl text-center font-black '>{t('title')}</h1>
        <FormItems
          handleAddItem={handleAddItem}
          items={listItems}
          isLightMode={isLightMode}
          direction={direction}
        />
        <ListItems
          items={listItems}
          handlePress={handlePress}
          isLightMode={isLightMode}
          direction={direction}
        />
        {listItems.length !== 0 && (
          <>
            <TrashBtn
              setIsModalOpen={setIsModalOpen}
              isLightMode={isLightMode}
            />
            <WhatsAppBtn
              listItems={listItems}
              isLightMode={isLightMode}
            />
          </>
        )}
      </div>
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          setListItems={setListItems}
          isLightMode={isLightMode}
          direction={direction}
        />
      )}
      <AllDone
        items={listItems}
        isLightMode={isLightMode}
      />
    </div>
  );
}

export default App;
