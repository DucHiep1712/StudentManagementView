import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import * as CourseStatus from "@/constants/courseStatus";
import ajax from "@/services/fetchServices";
import { useLocalStorage } from "@/util/useLocalStorage";
import { DialogClose } from "@radix-ui/react-dialog";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Course() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const courseId = window.location.href.split("/courses/")[1];
  const [course, setCourse] = useState({
    students: null,
    startDate: null,
    endDate: null,
    name: "",
  });

  const getBadge = () => {
    if (!(Date.parse(course.startDate) && Date.parse(course.endDate))) {
      return CourseStatus.ARCHIVED;
    }

    if (Date.parse(course.startDate) > new Date()) {
      return CourseStatus.STARTING_SOON;
    }

    if (Date.parse(course.endDate) < new Date()) {
      return CourseStatus.FINISHED;
    }

    return CourseStatus.IN_PROGRESS;
  };

  const removeStudent = () => {
    ajax("delete", `/api/courses/${courseId}/removeStudent`, null, jwt).then(
      () => {
        navigate("/dashboard");
      }
    );
  };

  useEffect(() => {
    ajax("get", `/api/courses/${courseId}`, null, jwt)
      .then((response) => {
        setCourse({
          ...response.data,
          name: response.data.name ? response.data.name : "",
        });
      })
      .catch((error) => {});
  }, []);

  console.log(course);

  return (
    <div className="container bg-background flex flex-col gap-y-12 items-center justify-center">
      <div className="w-full flex gap-4 items-center justify-between">
        <h1 className="font-bold text-4xl">
          <span className="font-semibold text-3xl">Course:</span> {course.name}
        </h1>
        <Badge
          style={{
            backgroundColor: getBadge().color,
          }}
        >
          {getBadge().status}
        </Badge>
      </div>
      <h1 className="font-bold text-4xl w-full">
        <span className="font-semibold text-3xl">Head teacher's ID:</span>{" "}
        {course?.teacherId}
      </h1>
      <div className="w-full grid grid-cols-2 gap-y-4 max-sm:grid-cols-1 max-sm:grid-flow-row place-content-center">
        <div className="self-start flex flex-col gap-2.5 justify-start">
          <Label htmlFor="startDate">Start date</Label>
          <div
            className="flex gap-2 rounded-md border items-center text-sm w-72 h-9 px-4 py-2"
            id="startDate"
          >
            <CalendarIcon className="h-4 w-4" />
            {course.startDate ? (
              course.startDate
            ) : (
              <span className="font-semibold text-muted-foreground">
                Unknown
              </span>
            )}
          </div>
        </div>
        <div className="self-start flex flex-col gap-2.5 justify-start">
          <Label htmlFor="endDate">End date</Label>
          <div
            className="flex gap-2 rounded-md border items-center text-sm w-72 h-9 px-4 py-2"
            id="endDate"
          >
            <CalendarIcon className="h-4 w-4" />
            {course.endDate ? (
              course.endDate
            ) : (
              <span className="font-semibold text-muted-foreground">
                Unknown
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-2.5 justify-start">
          <Label htmlFor="startDate">Student list</Label>
          <ul className="w-full grid grid-cols-2 max-md:grid-cols-1 gap-y-2.5 mt-4">
            {course.students
              ? course.students.map((student, index) => (
                  <li
                    className="w-full flex items-center gap-2.5"
                    key={`student-${index}`}
                  >
                    <div className="flex max-sm:w-full w-1/2 sm:w-2/3 items-center gap-6 px-2.5 py-4 bg-muted rounded-md border">
                      <img
                        className="w-10 h-10"
                        src="/user_avatar.png"
                        alt=""
                      />
                      <div className="flex flex-col gap-1.5 ">
                        <div className="text-sm font-semibold">
                          Student {student.id}
                        </div>
                        <div className="text-sm opacity-90">
                          Username {student?.username}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>
      {getBadge().status === CourseStatus.FINISHED.status ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Leave course</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>You are leaving this course!</DialogTitle>
              <DialogDescription>
                Every documents and exercises will be lost! Are you sure?
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between">
              <Button onClick={removeStudent}>Yes, I am</Button>
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
