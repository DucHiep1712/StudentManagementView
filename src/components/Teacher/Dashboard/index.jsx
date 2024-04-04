import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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
} from "../../ui/carousel";

export default function TeacherDashboard() {
  const { toast } = useToast();

  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const [courses, setCourses] = useState(null);

  const getCourses = () => {
    ajax("get", "/api/courses", null, jwt)
      .then((response) => {
        setCourses(response.data);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Server error",
          description: "Failed to get courses",
        });
      });
  };

  useEffect(() => {
    getCourses();
  }, []);

  const createCourse = () => {
    ajax("post", "/api/courses", null, jwt)
      .then(() => {
        getCourses();
        toast({
          title: "Update: Course added successfully",
          description: `Addition date: ${new Date()}`,
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Update: Course added failure",
          description: `Failure date: ${new Date()}`,
        });
      });
  };

  return (
    <div className="w-full flex gap-8 flex-col container">
      <h1 className="font-semibold text-4xl">Courses</h1>
      <div className="w-full border-b"></div>
      {courses && courses.length > 0 ? (
        <div className="flex items-center justify-center flex-col w-full">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {courses !== null
                ? courses?.map((course, index) => (
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
                              {course.startDate
                                ? course.startDate
                                : "Unknown"}{" "}
                              <span className="font-bold"> to </span>{" "}
                              {course.endDate ? course.endDate : "Unknown"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Mauris eu cursus nisi, nec maximus lorem.
                            Integer congue ipsum tellus, in semper eros gravida
                            vel. In ut turpis suscipit, gravida nisl at,
                            lobortis purus. In imperdiet orci sed interdum
                            sagittis. Morbi vitae justo massa. Ut eu fringilla
                            purus. Mauris scelerisque in leo mollis consequat.
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))
                : null}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      ) : (
        <div className="font-medium">No course found</div>
      )}

      <div>
        <Button onClick={createCourse}>Submit new course</Button>
      </div>
    </div>
  );
}
