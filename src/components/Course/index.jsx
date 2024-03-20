import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ajax from "@/services/fetchServices";
import { useLocalStorage } from "@/util/useLocalStorage";
import { useEffect, useState } from "react";

import { DatePicker } from "../ui/date-picker";

export default function Course() {
  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const courseId = window.location.href.split("/courses/")[1];
  const [course, setCourse] = useState({
    teacher: null,
    students: null,
    startDate: null,
    endDate: null,
    name: "",
  });

  const updateCourse = (prop, value) => {
    setCourse((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const saveCourse = () => {
    ajax("put", `/api/courses/${courseId}`, course, jwt).then((response) => {
      if (!response.data.name) {
        response.data.name = "";
      }
      setCourse(response.data);
    });
  };

  useEffect(() => {
    ajax("get", `/api/courses/${courseId}`, null, jwt)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {});
  }, []);

  return (
    <div className="container bg-background flex flex-col gap-y-16 items-center justify-center">
      <h1 className="w-full font-semibold text-4xl">Course {courseId}</h1>
      <div className="grid grid-flow-row grid-cols-6 w-full gap-2.5">
        <Label
          className="col-span-2 lg:col-span-1 place-self-start self-center"
          htmlFor="name"
        >
          Course name
        </Label>
        <Input
          className="col-span-4 lg:col-span-5"
          id="name"
          value={course.name}
          onChange={(event) => updateCourse("name", event.target.value)}
        />
      </div>
      <div className="w-full grid grid-cols-2 gap-y-4 grid-flow-col max-sm:grid-cols-1 max-sm:grid-flow-row place-content-center">
        <div className="self-start flex items-center gap-2.5 max-sm:justify-between">
          <Label htmlFor="startDate">Start date</Label>
          <DatePicker
            prop="startDate"
            value={course.startDate}
            action={updateCourse}
          />
        </div>
        <div className="self-start flex items-center gap-2.5 max-sm:justify-between">
          <Label htmlFor="endDate">End date</Label>
          <DatePicker
            prop="endDate"
            value={course.endDate}
            action={updateCourse}
          />
        </div>
      </div>
      <Button onClick={saveCourse}>Save course</Button>
    </div>
  );
}
