import { useEffect, useState } from "react"
import { Button } from "../Button"
import { Card } from "../Card"
import { CreateContentModal } from "../CreateContentModel"
import { PlusIcon } from "../../icons/PlusIcon"
import { ShareIcon } from "../../icons/ShareIcon";
import { Sidebar } from "../Sidebar"
import { useContent } from "../hooks/useContent"
import { MONGO_URL} from "../config"
import axios from "axios"

export function Dashboard(){
    const [modalOpen,setModalOpen]=useState(false);

    const {contents,refresh}=useContent();

    useEffect(()=>{
        refresh();
    },[modalOpen])
    return (
  <div>
    <Sidebar />
    
    <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
      <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} />
      
      <div className="flex justify-end gap-4">
        <Button onClick={() => setModalOpen(true)} variant="primary" text="Add content" startIcon={<PlusIcon />} />
        
        <Button
          onClick={async () => {
            const response = await axios.post(
              `${MONGO_URL}/api/v1/brain/share`,
              { share: true },
              { headers: { Authorization: localStorage.getItem("token") } }
            );
            const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
            alert(shareUrl);
          }}
          variant="secondary"
          text="Share brain"
          startIcon={<ShareIcon />}
        />
      </div>

      <div className="flex gap-4 flex-wrap">
        {contents.map(({ type, link, title }) => (
          <Card type={type} link={link} title={title} />
        ))}
      </div>
    </div>
  </div>
);


}