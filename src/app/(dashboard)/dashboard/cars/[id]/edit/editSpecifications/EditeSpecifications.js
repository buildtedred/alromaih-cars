"use client"

import { Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const EditeSpecifications = ({
  removeSpecification,
  removeSpecDetail,
  addSpecDetail,
  addSpecification,
  handleSpecDetailChange,
  handleSpecTitleChange,
  specifications,
}) => {
  return (
    <div className="space-y-4 border border-gray-200 rounded-md p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Product Specifications</h3>
        <Button onClick={addSpecification} size="sm" variant="outline" className="h-7 px-2 text-xs gap-1">
          <Plus className="h-3.5 w-3.5" />
          <span>Add Category</span>
        </Button>
      </div>

      <Separator className="my-2" />

      {!specifications || specifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
          <Badge variant="outline" className="mb-2">
            No specifications yet
          </Badge>
          <p className="text-sm">Add a specification category to get started</p>
        </div>
      ) : (
        <ScrollArea className="h-[35vh] pr-2">
          <div className="space-y-3">
            {specifications.map((category, catIndex) => (
              <Card key={catIndex} className="overflow-hidden shadow-sm">
                <div className="bg-muted p-2 flex items-center justify-between">
                  <Input
                    className="max-w-[70%] bg-background h-7 text-sm"
                    placeholder="Category Title"
                    value={category.title || ""}
                    onChange={(e) => handleSpecTitleChange(catIndex, e.target.value)}
                    required
                  />
                  <Button
                    onClick={() => removeSpecification(catIndex)}
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Remove category</span>
                  </Button>
                </div>

                <CardContent className="p-2 space-y-2">
                  {category.details &&
                    category.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                        <Input
                          placeholder="Label"
                          value={detail.label || ""}
                          onChange={(e) => handleSpecDetailChange(catIndex, detailIndex, "label", e.target.value)}
                          required
                          className="h-7 text-xs"
                        />
                        <Input
                          placeholder="Value"
                          value={detail.value || ""}
                          onChange={(e) => handleSpecDetailChange(catIndex, detailIndex, "value", e.target.value)}
                          required
                          className="h-7 text-xs"
                        />
                        <Button
                          onClick={() => removeSpecDetail(catIndex, detailIndex)}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span className="sr-only">Remove detail</span>
                        </Button>
                      </div>
                    ))}

                  <Button
                    onClick={() => addSpecDetail(catIndex)}
                    variant="outline"
                    size="sm"
                    className="mt-1 w-full h-6 text-xs gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Detail</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

export default EditeSpecifications
