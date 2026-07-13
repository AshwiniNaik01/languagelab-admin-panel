"use client";

import { useRouter, useSearchParams } from "next/navigation";
import EditorLayout from "../../../layouts/EditorLayout";

import {
  FileText,
  Video,
  Headphones,
  ClipboardCheck,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Layers,
} from "lucide-react";


const modules = [
  {
    id: "text",
    title: "Text",
    subtitle: "Reading lessons",
    description: "Manage articles and reading content.",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    route: "/editor/modules/text",
  },
  {
    id: "video",
    title: "Video",
    subtitle: "Video lessons",
    description: "Upload and manage video lessons.",
    icon: Video,
    color: "from-red-500 to-orange-500",
    route: "/editor/modules/video",
  },
  {
    id: "audio",
    title: "Audio",
    subtitle: "Listening practice",
    description: "Manage audio learning content.",
    icon: Headphones,
    color: "from-purple-500 to-pink-500",
    route: "/editor/modules/audio",
  },
  {
    id: "exercise",
    title: "Exercise",
    subtitle: "Quiz & practice",
    description: "Create assessments and quizzes.",
    icon: ClipboardCheck,
    color: "from-green-500 to-emerald-500",
    route: "/editor/modules/exercise",
  },
  {
    id: "vocabulary",
    title: "Vocabulary",
    subtitle: "Words & meanings",
    description: "Build vocabulary learning sets.",
    icon: BookOpen,
    color: "from-orange-500 to-amber-500",
    route: "/editor/modules/vocabulary",
  },
];


export default function ModuleOverviewPage() {

  const router = useRouter();

  const searchParams = useSearchParams();


  const topicId = searchParams.get("topicId");
  const subtopicId = searchParams.get("subtopicId");



  return (

    <EditorLayout>


      <div className="space-y-5">


        {/* Breadcrumb */}

        <div className="
          flex 
          items-center 
          gap-2 
          text-xs 
          text-slate-500
        ">


          <button
            onClick={() => router.back()}
            className="
              flex 
              items-center 
              gap-1
              hover:text-orange-600
              transition
              cursor-pointer
            "
          >

            <ArrowLeft size={13}/>
            Back

          </button>


          <ChevronRight size={13}/>


          <span>
            Curriculum
          </span>


          <ChevronRight size={13}/>


          <span className="font-semibold text-slate-700">
            Module Overview
          </span>


        </div>




        {/* Header */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-5
          shadow-sm
        ">


          <div className="flex items-center gap-4">


            <div className="
              w-12
              h-12
              rounded-2xl
              bg-orange-500
              text-white
              flex
              items-center
              justify-center
            ">

              <Layers size={24}/>

            </div>



            <div>

              <h1 className="
                text-xl
                font-black
                text-slate-900
              ">
                Module Overview
              </h1>


              <p className="
                text-sm
                text-slate-500
                mt-1
              ">
                Manage and organize learning modules.
              </p>


            </div>


          </div>




          {/* Selected IDs */}

          {(topicId || subtopicId) && (

            <div className="
              flex
              gap-3
              mt-5
            ">


              {
                topicId && (

                  <div className="
                    px-3
                    py-1.5
                    rounded-full
                    bg-orange-50
                    text-orange-700
                    text-xs
                    font-bold
                  ">

                    Topic Selected

                  </div>

                )
              }



              {
                subtopicId && (

                  <div className="
                    px-3
                    py-1.5
                    rounded-full
                    bg-slate-100
                    text-slate-600
                    text-xs
                    font-bold
                  ">

                    SubTopic Selected

                  </div>

                )
              }


            </div>

          )}



        </div>





        {/* Module Cards */}


        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
          gap-4
        ">


          {
            modules.map((module)=>{


              const Icon = module.icon;


              return (

                <button

                  key={module.id}


                  onClick={()=>{

                    router.push(
                      `${module.route}?topicId=${topicId}&subtopicId=${subtopicId}`
                    );

                  }}


                  className="
                    group
                    relative
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-5
                    text-left
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                    hover:border-orange-300
                    cursor-pointer
                  "

                >


                  <div
                    className={`
                      w-12
                      h-12
                      rounded-xl
                      bg-gradient-to-br
                      ${module.color}
                      flex
                      items-center
                      justify-center
                      text-white
                      mb-4
                      shadow-sm
                    `}
                  >

                    <Icon size={22}/>

                  </div>




                  <h3 className="
                    text-base
                    font-black
                    text-slate-900
                  ">

                    {module.title}

                  </h3>




                  <p className="
                    text-xs
                    font-semibold
                    text-orange-600
                    mt-1
                  ">

                    {module.subtitle}

                  </p>




                  <p className="
                    text-xs
                    text-slate-500
                    mt-3
                    leading-relaxed
                  ">

                    {module.description}

                  </p>




                  <div className="
                    absolute
                    right-4
                    bottom-4
                    opacity-0
                    group-hover:opacity-100
                    transition
                    text-orange-500
                  ">

                    <ChevronRight size={18}/>

                  </div>



                </button>


              );


            })
          }


        </div>







        {/* Bottom Info */}


        <div className="
          rounded-2xl
          border
          border-orange-100
          bg-gradient-to-br
          from-orange-50
          to-white
          p-6
        ">



          <div className="
            flex
            items-center
            gap-4
          ">


            <div className="
              w-10
              h-10
              rounded-xl
              bg-orange-500
              text-white
              flex
              items-center
              justify-center
            ">

              <BookOpen size={18}/>

            </div>



            <div>


              <h3 className="
                font-bold
                text-slate-800
              ">

                Content Management Workflow

              </h3>


              <p className="
                text-sm
                text-slate-500
                mt-1
              ">

                Select a module type to create, edit and organize learning content.

              </p>


            </div>



          </div>



        </div>




      </div>


    </EditorLayout>

  );

}