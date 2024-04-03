import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import ajax from "@/services/fetchServices";
import { useLocalStorage } from "@/util/useLocalStorage";
import { DialogClose } from "@radix-ui/react-dialog";
import { Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { toast } = useToast();

  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const [users, setUsers] = useState([]);

  const getAllUsers = () => {
    ajax("get", "api/users", null, jwt).then((response) => {
      console.log(response.data);
      setUsers(
        response.data.filter(
          (user) => user.authorities[0].name !== "ROLE_ADMIN"
        )
      );
    });
  };

  const deleteUser = (toDeleteId) => {
    ajax("delete", `api/users/${toDeleteId}`, null, jwt)
      .then((response) => {
        console.log(response.data);
        if (response.data) {
          toast({
            title: "User update",
            description: "Delete user successfully",
          });
          getAllUsers;
        } else {
          toast({
            variant: "destructive",
            title: "User update",
            description: "Couldn't delete user",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "User update",
          description: "Couldn't delete user",
        });
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="w-full bg-background container">
      <h1 className="font-bold mb-12 text-4xl">User list</h1>
      {users?.length > 0 ? (
        <ul className="w-full grid grid-cols-1 gap-y-2.5 mt-4">
          {users.map((user, index) => (
            <li
              className="w-full flex items-center gap-2.5"
              key={`user-${index}`}
            >
              <div className="flex w-full justify-between items-center px-2.5 py-4 bg-muted rounded-md border">
                <div className="flex items-center gap-6">
                  <img className="w-10 h-10" src="/user_avatar.png" alt="" />
                  <div className="flex flex-col gap-1.5 ">
                    <div className="text-sm font-semibold">
                      User ID: {user.id}
                    </div>
                    <div className="text-sm opacity-90">
                      Username {user.username}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>You are deleting an user</DialogTitle>
                        <DialogDescription>
                          All data about this user will be deleted permanently!
                          Are you sure?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center justify-between">
                        <Button onClick={() => deleteUser(user.id)}>
                          Confirm
                        </Button>
                        <DialogClose>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm font-semibold">No user found</div>
      )}
    </div>
  );
}
