"use client";
import axios from "axios";
import * as z from "zod";
import Heading from "@/components/heading";
import {
  Download,
  ImageIcon,
  Loader,
  MessageSquare,
  Music,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";

const MusicPage = () => {
  const router = useRouter();
  const [music, setMusic] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic("");
      const response = await axios.post("/api/music", values);
      setMusic(response.data.audio);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      router.refresh();
    }
  };
  return (
    <>
      <Heading
        title="Music Generation"
        description="Our most advanced music model"
        icon={Music}
        iconColor="text-yellow-500"
        bgColor="bg-yellow-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        placeholder="A picture of a horse in Swiss Alps"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader className="animate-spin" />
              </div>
            )}
            {music?.length === 0 && !isLoading && (
              <Empty label={"No Music generated"}></Empty>
            )}
            <div className="grid grid-cols-1">
              {music && (
                <audio controls className="w-full mt-8">
                  <source src={music} />
                </audio>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPage;
