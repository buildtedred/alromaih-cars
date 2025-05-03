"use client"

import { Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const EditeSpecifications = ({
  addSpecDetail,
  handleSpecTitleChange,
  handleSpecDetailChange,
  removeSpecDetail,
  addSpecification,
  specifications,
  removeSpecification,
  disabled = false,
}) => {
  return (
    <div className="space-y-4 p-1 shadow-sm">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          onClick={addSpecification}
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs gap-1 rounded-[5px] border-brand-light hover:bg-brand-light"
          disabled={disabled}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Category</span>
        </Button>
      </div>

      {specifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
          <Badge variant="outline" className="mb-2 rounded-[5px]">
            No specifications yet
          </Badge>
          <p className="text-sm">Add a specification category to get started</p>
        </div>
      ) : (
        <ScrollArea className="h-[35vh] pr-2">
          <div className="space-y-3">
            {specifications.map((category, catIndex) => (
              <Card key={catIndex} className="overflow-hidden shadow-sm rounded-[5px] border-brand-light">
                <div className="flex h-full">
                  {/* Left side - Category */}
                  <div className="bg-brand-light/20 p-2 flex flex-col w-1/3 border-r border-brand-light/30">
                    <div className="flex items-center justify-between mb-2">
                      <Input
                        className="bg-background h-7 text-sm rounded-[5px] w-full"
                        placeholder="Category Title"
                        value={category.title}
                        onChange={(e) => handleSpecTitleChange(catIndex, e.target.value)}
                        required
                        disabled={disabled}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <Badge variant="outline" className="text-xs rounded-full px-2 py-0 h-5">
                        {category.details.length} {category.details.length === 1 ? "item" : "items"}
                      </Badge>
                      <Button
                        type="button"
                        onClick={() => removeSpecification(catIndex)}
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6 rounded-[5px]"
                        disabled={disabled}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Remove category</span>
                      </Button>
                    </div>
                  </div>

                  {/* Right side - Details */}
                  <div className="w-2/3">
                    <CardContent className="p-2 space-y-2">
                      {category.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2">
                          <div className="flex-1 flex gap-2">
                            <Input
                              placeholder="Label"
                              value={detail.label}
                              onChange={(e) => handleSpecDetailChange(catIndex, detailIndex, "label", e.target.value)}
                              required
                              className="h-7 text-xs rounded-[5px] flex-1"
                              disabled={disabled}
                            />
                            <Input
                              placeholder="Value"
                              value={detail.value}
                              onChange={(e) => handleSpecDetailChange(catIndex, detailIndex, "value", e.target.value)}
                              required
                              className="h-7 text-xs rounded-[5px] flex-1"
                              disabled={disabled}
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => removeSpecDetail(catIndex, detailIndex)}
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-[5px] flex-shrink-0"
                            disabled={disabled}
                          >
                            <X className="h-3.5 w-3.5" />
                            <span className="sr-only">Remove detail</span>
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        onClick={() => addSpecDetail(catIndex)}
                        variant="outline"
                        size="sm"
                        className="mt-1 w-full h-6 text-xs gap-1 rounded-[5px] border-brand-light hover:bg-brand-light/20"
                        disabled={disabled}
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Detail</span>
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

export default EditeSpecifications
