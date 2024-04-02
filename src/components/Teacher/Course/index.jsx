import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import * as CourseStatus from "@/constants/courseStatus";
import ajax from "@/services/fetchServices";
import { useLocalStorage } from "@/util/useLocalStorage";
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
  const [studentId, setStudentId] = useState("");
  const [unenrolledStudents, setUnenrolledStudens] = useState([]);

  const updateCourse = (prop, value) => {
    if (prop === "startDate") {
      if (course.endDate) {
        if (value >= course.endDate) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong",
            description: "End date cannot be prior to start date",
          });
          return;
        }
      }
    }

    if (prop === "endDate") {
      if (course.startDate) {
        if (value <= course.startDate) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong",
            description: "End date cannot be prior to start date",
          });
          return;
        }
      }
    }

    setCourse((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

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

  const saveCourse = () => {
    ajax("put", `/api/courses/${courseId}`, course, jwt).then((response) => {
      if (!response.data.name) {
        response.data.name = "";
      }
      setCourse(response.data);
      navigate(-1);
    });
  };

  const getUnenrolledStudents = () => {
    ajax("get", `/api/courses/${courseId}/students`, null, jwt)
      .then((response) => {
        setUnenrolledStudens(response.data);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong",
          description: "Couldn't get unenrolled students",
        });
      });
  };

  const addStudent = (toAddId) => {
    ajax("post", `/api/courses/${courseId}/addStudent`, parseInt(toAddId), jwt)
      .then((response) => {
        if (typeof response.data === "string") {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong",
            description: "Couldn't add student to course",
          });
        } else {
          setCourse(response.data);
          getUnenrolledStudents();
          toast({
            title: "Update status",
            description: "Student added successfully",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong",
          description: "Couldn't add student to course",
        });
      });
  };

  const removeStudent = (toRemoveId) => {
    ajax(
      "post",
      `/api/courses/${courseId}/removeStudent`,
      parseInt(toRemoveId),
      jwt
    )
      .then((response) => {
        if (typeof response.data === "string") {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong",
            description: "Couldn't remove student from course",
          });
        } else {
          setCourse(response.data);
          getUnenrolledStudents();
          toast({
            title: "Update status",
            description: "Student removed successfully",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong",
          description: "Couldn't remove student from course",
        });
      });
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

  return (
    <div className="container bg-background flex flex-col gap-y-12 items-center justify-center">
      <div className="w-full flex gap-4 items-center justify-between">
        <h1 className="font-bold text-4xl">Course : {course.name}</h1>
        <Badge
          style={{
            backgroundColor: getBadge().color,
          }}
        >
          {getBadge().status}
        </Badge>
      </div>
      <div className="w-full flex flex-col gap-2.5">
        <Label className="inline-block" htmlFor="name">
          Course name
        </Label>
        <Input
          id="name"
          value={course.name}
          onChange={(event) => updateCourse("name", event.target.value)}
        />
      </div>
      <div className="w-full grid grid-cols-2 gap-y-4 max-sm:grid-cols-1 max-sm:grid-flow-row place-content-center">
        <div className="self-start flex flex-col gap-2.5 justify-start">
          <Label htmlFor="startDate">Start date</Label>
          <DatePicker
            prop="startDate"
            value={course.startDate}
            action={updateCourse}
          />
        </div>
        <div className="self-start flex flex-col gap-2.5 justify-start">
          <Label htmlFor="endDate">End date</Label>
          <DatePicker
            prop="endDate"
            value={course.endDate}
            action={updateCourse}
          />
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-2.5 justify-start">
          <Label htmlFor="startDate">Student list</Label>
          <ul className="w-full grid grid-cols-2 sm:max-md:grid-cols-1 gap-y-2.5 mt-4">
            {course?.students
              ? course?.students?.map((student, index) => (
                  <li
                    className="w-full flex items-center gap-2.5"
                    key={`student-${index}`}
                  >
                    <div className="flex w-1/2 sm:w-2/3 items-center gap-6 px-2.5 py-4 bg-muted rounded-md border">
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
                          Username {student.username}
                        </div>
                      </div>
                    </div>
                    <Button
                      className="hover:text-destructive"
                      variant="link"
                      onClick={() => removeStudent(student.id)}
                    >
                      Remove
                    </Button>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <Button onClick={saveCourse}>Save course</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={getUnenrolledStudents}>
              Add student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Student list</DialogTitle>
              <DialogDescription>
                Add students that are not already enrolled in this course
              </DialogDescription>
            </DialogHeader>
            <Input
              type="number"
              value={studentId}
              placeholder="Student's id"
              onChange={(event) => setStudentId(event.target.value)}
            />
            <div className="w-full flex flex-col items-center gap-2.5">
              {unenrolledStudents.length > 0 ? (
                unenrolledStudents.map((student, index) => {
                  if (
                    (studentId !== "" &&
                      student.id.toString().includes(studentId.toString())) ||
                    studentId === ""
                  ) {
                    return (
                      <div
                        key={`unenrolled-student-${index}`}
                        className="w-full flex gap-2.5 items-center"
                      >
                        <div className="w-full px-2.5 py-4 bg-muted rounded-md border flex items-center gap-4">
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
                              Username {student.username}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => addStudent(student.id)}
                          variant="link"
                        >
                          Add
                        </Button>
                      </div>
                    );
                  }
                })
              ) : (
                <div className="w-full text-sm font-medium">
                  No one's here...
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
