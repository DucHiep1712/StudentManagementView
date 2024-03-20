import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ajax from "@/services/fetchServices";
import { useLocalStorage } from "@/util/useLocalStorage";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export default function Dashboard() {
  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    ajax("get", "/api/courses", null, jwt)
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {});
  }, []);

  const createCourse = () => {
    ajax("post", "/api/courses", null, jwt);
  };

  return (
    <div className="w-full flex gap-8 flex-col container">
      <h1 className="font-semibold text-4xl">Courses</h1>
      {courses && courses.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {courses.map((course, index) => (
              <CarouselItem
                key={`course-${index}`}
                className="sm:basis-1 md:basis-1/2 lg:basis-1/3"
              >
                <Link to={`/courses/${course.id}`}>
                  <Card className="cursor-pointer">
                    <CardHeader>
                      <CardTitle>
                        {course.name ? course.name : "Course name"}
                      </CardTitle>
                      <CardDescription>
                        <span className="font-bold">From </span>
                        {course.startDate ? course.startDate : "Unknown"}{" "}
                        <span className="font-bold"> to </span>{" "}
                        {course.endDate ? course.endDate : "Unknown"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Mauris eu cursus nisi, nec maximus lorem. Integer congue
                      ipsum tellus, in semper eros gravida vel. In ut turpis
                      suscipit, gravida nisl at, lobortis purus. In imperdiet
                      orci sed interdum sagittis. Morbi vitae justo massa. Ut eu
                      fringilla purus. Mauris scelerisque in leo mollis
                      consequat.
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <></>
      )}
    </div>
  );
}
