import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { ArrowLeft, Video, VideoOff, Mic, MicOff, Monitor, PhoneOff, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/models/routes";

const Demo = () => {
  const navigate = useNavigate();
  const [callStarted, setCallStarted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  return (
    <div className="min-h-screen bg-dotted p-4 md:p-8">
      <PageTransition className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.HOME)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="bg-card rounded-2xl shadow-lg border overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-foreground">Showcase Demo For Client</h1>
            <p className="text-muted-foreground mt-1">Start a live demo session</p>
          </div>

          {!callStarted ? (
            <div className="p-12 flex flex-col items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Video className="w-10 h-10 text-primary" />
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  onClick={() => setCallStarted(true)}
                  className="px-8 py-6 text-lg rounded-xl"
                >
                  Start Demo Call
                </Button>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Mock video area */}
              <div className="aspect-video bg-foreground/95 relative flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground/70 text-sm">Waiting for participants...</p>
                </div>
                {/* Self view */}
                <div className="absolute bottom-4 right-4 w-32 h-24 md:w-48 md:h-36 rounded-lg bg-foreground/80 border border-muted-foreground/20 flex items-center justify-center overflow-hidden">
                  {videoOn ? (
                    <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">You</span>
                    </div>
                  ) : (
                    <VideoOff className="w-6 h-6 text-muted-foreground/50" />
                  )}
                </div>
                {/* Timer */}
                <div className="absolute top-4 left-4 bg-foreground/60 text-primary-foreground px-3 py-1 rounded-full text-sm">
                  00:00
                </div>
              </div>

              {/* Controls */}
              <div className="p-4 flex items-center justify-center gap-3 bg-card border-t">
                <Button
                  variant={micOn ? "secondary" : "destructive"}
                  size="icon"
                  className="rounded-full w-12 h-12"
                  onClick={() => setMicOn(!micOn)}
                >
                  {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>
                <Button
                  variant={videoOn ? "secondary" : "destructive"}
                  size="icon"
                  className="rounded-full w-12 h-12"
                  onClick={() => setVideoOn(!videoOn)}
                >
                  {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full w-12 h-12"
                >
                  <Monitor className="w-5 h-5" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full w-12 h-12"
                  onClick={() => setCallStarted(false)}
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </PageTransition>
    </div>
  );
};

export default Demo;
