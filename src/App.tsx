import { useState, useEffect } from "react";
import { listItem } from "./types/listTypes";
import {
  ListItems,
  FormItems,
  TrashBtn,
  AllDone,
  Modal,
  ToggleSwitch,
  WhatsAppBtn,
  EditBtn,
} from "./components";

function App() {
  const [listItems, setListItems] = useState<listItem[]>(
    localStorage.items ? JSON.parse(localStorage.items) : []
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<listItem | null>(null);

  useEffect(() => {
    localStorage.items = JSON.stringify(listItems);
  }, [listItems]);

  const handlePress = (id: number, btnState: boolean) => {
    if (isEditing) {
      for (const item of listItems)
        if (item.id === id) {
          setEditItem(item);
          return;
        }
    }

    const updatedList = listItems.map((item) =>
      item.id === id ? { ...item, isChecked: btnState } : item
    );
    setListItems(updatedList);
  };

  const handleAddItem = (name: string, quantity: number) => {
    const itemIndex = listItems.findIndex(
      (itemName) =>
        itemName.name.trim().toLowerCase() === name.trim().toLowerCase()
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

  const handleEditList = ({
    shouldKeepEditing,
  }: {
    shouldKeepEditing?: boolean;
  }) => {
    setIsEditing(
      typeof shouldKeepEditing === "boolean" ? shouldKeepEditing : !isEditing
    );
    setEditItem(null);
  };


  const handleEditItem = (name: string, quantity: number) => {
    const updatedList = listItems.map((item) =>
      item.id === editItem?.id
        ? { ...item, name: name, quantity: quantity }
        : item
    );
    setListItems(updatedList);
    setEditItem(null);
  };

  const handleDeleteItem = () => {
    const updatedList = listItems.filter((item) => item.id !== editItem?.id);
    setListItems(updatedList);
    setEditItem(null);
    if (updatedList.length === 0) setIsEditing(false);
  };

  return (
    <div
      className={`min-h-screen ${
        isLightMode ? "text-gray-950  bg-[wheat]" : "bg-zinc-800  text-white"
      } flex flex-col items-center justify-between relative`}
    >
      <ToggleSwitch isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
      <div className="mx-auto container px-4 pt-16 mb-[60px] pb-[60px] md:w-[600px] ">
        <h1 className="text-4xl text-center font-black ">🍪 עגלת קניות</h1>
        <FormItems
          handleAddItem={handleAddItem}
          handleEditItem={handleEditItem}
          handleDeleteItem={handleDeleteItem}
          items={listItems}
          isLightMode={isLightMode}
          isEditing={isEditing}
          editItem={editItem}
        />
        <ListItems
          items={listItems}
          handlePress={handlePress}
          isLightMode={isLightMode}
          isEditing={isEditing}
          editItem={editItem}
        />
        {listItems.length !== 0 && (
          <>
            <TrashBtn
              setIsModalOpen={setIsModalOpen}
              isLightMode={isLightMode}
            />
            <WhatsAppBtn listItems={listItems} isLightMode={isLightMode} />

            <EditBtn
              handleEditList={handleEditList}
              isLightMode={isLightMode}
              isEditing={isEditing}
            />
          </>
        )}
      </div>
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          setListItems={setListItems}
          isLightMode={isLightMode}
          handleEditList={handleEditList}
        />
      )}
      <AllDone items={listItems} isLightMode={isLightMode} />
    </div>
  );
}

export default App;
