// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

export default function GameOnPreview() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-[#4db8a8]" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] dark:text-white">Game On!</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Zie wie deze week het meest heeft gerecycled</p>
        </div>
        
        <Card className="border-2 border-[#4db8a8] bg-gradient-to-br from-[#4db8a8]/5 to-transparent dark:bg-[#1a2f3f]">
          <CardContent className="p-8">
            <div className="space-y-4">
              {/* Top 3 Podium Style */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <div className="text-center pt-8">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mb-2">
                    <Medal className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">2</p>
                  </div>
                  <p className="font-semibold text-[#1a3a52] dark:text-white">EMMA</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">42 items</p>
                </div>
                {/* 1st Place */}
                <div className="text-center">
                  <div className="bg-gradient-to-br from-[#4db8a8] to-[#1a3a52] rounded-lg p-6 mb-2">
                    <Trophy className="w-12 h-12 mx-auto text-white mb-2" />
                    <p className="text-3xl font-bold text-white">1</p>
                  </div>
                  <p className="font-bold text-[#1a3a52] dark:text-white text-lg">JOHN</p>
                  <p className="text-sm text-[#4db8a8] font-semibold">47 items</p>
                </div>
                {/* 3rd Place */}
                <div className="text-center pt-12">
                  <div className="bg-orange-100 rounded-lg p-4 mb-2">
                    <Medal className="w-8 h-8 mx-auto text-orange-400 mb-2" />
                    <p className="text-2xl font-bold text-orange-600">3</p>
                  </div>
                  <p className="font-semibold text-[#1a3a52] dark:text-white">ALEX</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">38 items</p>
                </div>
              </div>
              
              <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button asChild size="lg" className="bg-[#1a3a52] hover:bg-[#0d1f2d]">
                  <a href="/leaderboard">Bekijk Volledig Klassement</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
